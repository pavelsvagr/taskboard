module.exports = {
  "name" : "Team validation",
  "tests": [
    {
      "name":  "Missing all",
      "data": {}
    },
    {
      "name": "Missing name",
      "data": {
        "identifier": "test-intergration-team"
      }
    },
    {
      "name": "Mssing identifier",
      "data": {
        "name": "team integration test"
      }
    },
    {
      "name": "Invalid name",
      "data": {
        "name": "tom",
        "identifier": "test-intergration-team"
      }
    },
    {
      "name": "Invalid identifier",
      "data": {
        "name": "team integration test",
        "identifier": "š+ěščad"
      }
    },
    {
      "name": "Invalid identifier 2",
      "data": {
        "name": "team integration test",
        "identifier": ""
      }
    },
    {
      "name": "Invalid color",
      "data": {
        "name": "team integration test",
        "identifier": "test-intergration-team",
        "color": "not existing color"
      }
    },
    {
      "name": "Invalid color 2",
      "data": {
        "name": "team integration test",
        "identifier": "test-intergration-team",
        "color": null
      }
    }
  ]
}