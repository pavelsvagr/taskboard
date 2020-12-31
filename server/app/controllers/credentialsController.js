const CryptoJS = require("crypto-js")
const Credentials = require("../model/entities/Credentials")
const credentialsRepository = require("../model/repositories/CredentialsRepository")
const boardsRepository = require("../model/repositories/BoardsRepository")
const ValidationError = require("../exceptions/ValidationError")
const { createApiConnector } = require("../services/external/connectors")
const AppError = require("../exceptions/AppError")
const keys = require("../../config/keys")

/**
 * Returns all credentials from database
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const { search, offset, limit } = req.query

  const searchProps = {
    limit,
    offset: (offset) * limit
  }
  const searchQuery = search ? {
    $or: [
      { name: new RegExp(search, "i") },
      { url: new RegExp(search, "i") }
    ]
  } : {}

  const count = await credentialsRepository.find(searchQuery, { count: true })
  const credentials = await credentialsRepository.find(searchQuery, searchProps)

  res.send({ data: credentials, limit, offset, count })
}

/**
 * Returns credentials for given id
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.get = async(req, res) => {
  const { credentials } = res.locals
  credentials.apiKey = undefined
  res.send(credentials)
}

/**
 * Returns api key for given credentials
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getApiKey = async (req, res) => {
  const { credentials } = res.locals

  const { apiKey } = credentials

  const decrypted = CryptoJS.AES.decrypt(apiKey, keys.encryptPassphrase).toString(CryptoJS.enc.Utf8)
  res.send(decrypted)
}

/**
 * Updates credentials by given values
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {
  const { name } = req.body

  const { credentials } = res.locals

  let newCredentials = credentials
  if (name) {
    credentials.name = name
    newCredentials = await credentialsRepository.update(credentials)
  }

  res.send(newCredentials)
}

/**
 * Deletes credentials by given values
 * @param req
 * @param res
 * @return {Promise<void>}
 * @param next
 */
exports.delete = async (req, res, next) => {
  let { credentials } = res.locals

  const boardCount = await boardsRepository.find({ credentials: credentials._id }, { count: true })

  if (boardCount) {
    next(new AppError(`There are still ${boardCount} boards using this credentials. Delete them first.`))
    return
  }

  credentials = await credentialsRepository.remove(credentials)

  credentials.apiKey = undefined

  res.send(credentials)
}

/**
 * Creates credentials
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {function} next
 * @return {Promise<void>}
 */
exports.create = async (req, res, next) => {
  const { name, type, url, apiKey } = req.body

  // Create external api connector
  const api = createApiConnector(type, url, apiKey)

  // Try to access external API
  if (!api || !(await api.tryAccess())) {
    next(
      new ValidationError([{
        location: "body",
        param: ["apiKey", "url"],
        msg: `Can't access external ${type} API with given URL and API key.`
      }])
    )
    return
  }


  // Save credentials
  const encryptedKey = CryptoJS.AES.encrypt(apiKey, keys.encryptPassphrase).toString()

  const newCredentials = await credentialsRepository.create(
    new Credentials(name, type, url, encryptedKey, req.user._id)
  )
  newCredentials.apiKey = undefined

  res.send(newCredentials)
}
