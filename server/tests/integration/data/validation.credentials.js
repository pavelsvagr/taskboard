const keys = require("../../../config/keys")

module.exports = {
  "name" : "Credentials validation",
  "tests": [
    {
      "name":  "Missing all",
      "data": {}
    },
    {
      "name": "Missing name",
      "data": {
        "url": keys.testCredentialsRedmineUrl,
        "apiKey": keys.testCredentialsRedmineApiKey,
        "type": "redmine"
      }
    },
    {
      "name": "Missing type",
      "data": {
        "name": "test integration credentials",
        "url": keys.testCredentialsRedmineUrl,
        "apiKey": keys.testCredentialsRedmineApiKey,
      }
    },
    {
      "name": "Missing api key",
      "data": {
        "name": "test integration credentials",
        "url": keys.testCredentialsRedmineUrl,
        "type": "redmine"
      }
    },
    {
      "name": "Missing url",
      "data": {
        "name": "test integration credentials",
        "apiKey": keys.testCredentialsRedmineApiKey,
        "type": "redmine"
      }
    },
    {
      "name": "Invalid api key",
      "data": {
        "name": "test integration credentials",
        "url": keys.testCredentialsRedmineUrl,
        "apiKey": "asdasdasdasdasdasdasd",
        "type": "redmine"
      }
    },
    {
      "name": "Invalid url",
      "data": {
        "name": "test integration credentials",
        "url": "invalidurl",
        "apiKey": keys.testCredentialsRedmineApiKey,
        "type": "redmine"
      }
    },
    {
      "name": "Invalid type",
      "data": {
        "name": "test integration credentials",
        "url": keys.testCredentialsRedmineUrl,
        "apiKey": keys.testCredentialsRedmineApiKey,
        "type": "redmin"
      }
    },
    {
      "name": "Invalid name",
      "data": {
        "name": "te",
        "url": keys.testCredentialsRedmineUrl,
        "apiKey": keys.testCredentialsRedmineApiKey,
        "type": "redmine"
      }
    }
  ]
}