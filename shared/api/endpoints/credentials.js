const {URL_API_NAMESPACE} = require('../../constants/http')

const URL_CREDENTIALS = '/credentials'
const URL_API_KEY = '/apiKey'

const credentials = () => URL_API_NAMESPACE + URL_CREDENTIALS
const one = (id) => credentials() + '/' + id
const apiKey = (id) => one(id) + URL_API_KEY

module.exports = {
    credentials,
    one,
    apiKey
}