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
        "email": "test-integration@example.org",
      }
    },
    {
      "name": "Missing email",
      "data": {
        "name": "test integration user",
      }
    },
    {
      "name": "Invalid name",
      "data": {
        "name": "te",
        "email": "test-integration@example.org",
      }
    },
    {
      "name": "Invalid email",
      "data": {
        "name": "test integration user",
        "email": "test-integrationexample.org",
      }
    },
  ]
}