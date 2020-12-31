const mongoose = require("mongoose")
const CryptoJS = require("crypto-js")

const keys = require("../../config/keys")
const CredentialsModel = require("../../app/model/models/Credentials")
const credentialsTypes = require("../../../shared/constants/credentialTypes")

const Credentials = mongoose.model(CredentialsModel.SCHEMA)

async function prepareTestCredentials(owner) {
  const testCredentials = new Credentials()
  testCredentials.apiKey = CryptoJS.AES.encrypt(keys.testCredentialsRedmineApiKey, keys.encryptPassphrase).toString()
  testCredentials.url = keys.testCredentialsRedmineUrl
  testCredentials.type = credentialsTypes.Redmine
  testCredentials.creator = owner
  testCredentials.name = '_test-credentials'
  return testCredentials.save()
}

async function cleanTestCredentials() {
  await Credentials.deleteOne({name: '_test-credentials'})
}

module.exports = {
  cleanTestCredentials,
  prepareTestCredentials
}