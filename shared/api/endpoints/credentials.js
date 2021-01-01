const {URL_API_NAMESPACE} = require('../../constants/http')

const credentials = () => `${URL_API_NAMESPACE}/credentials`
const one = (id) => `${credentials()}/${id}`
const apiKey = (id) => `${one(id)}/apiKey`

module.exports = {
  credentials,
  one,
  apiKey
}