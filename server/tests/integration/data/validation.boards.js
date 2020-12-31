module.exports = {
  "name" : "Board validation",
  "tests": [
    {
      "name":  "Missing all",
      "data": {}
    },
    {
      "name": "Invalid priority",
      "data": {
        "priorities": 0,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "weeks",
        "assignment": "issues"
      }
    },
    {
      "name": "Invalid priority 2",
      "data": {
        "priorities": 6,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "weeks",
        "assignment": "issues"
      }
    },
    {
      "name": "Invalid priority 3",
      "data": {
        "priorities": "a",
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "weeks",
        "assignment": "issues"
      }
    },
    {
      "name": "Invalid intervals",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "weks",
        "assignment": "issues"
      }
    },
    {
      "name": "Invalid intervals 2",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": 2,
        "assignment": "issues"
      }
    },
    {
      "name": "Invalid assignments 1",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "days",
        "assignment": "issue"
      }
    },
    {
      "name": "Invalid assignments 2",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "days",
        "assignment": null
      }
    },
    {
      "name": "Invalid assignments 3",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "days",
        "assignment": 5
      }
    },
    {
      "name": "Invalid identifier",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "-test-validation-board",
        "intervals": "days",
        "assignment": "intervals"
      }
    },
    {
      "name": "Invalid identifier 2",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "test-validřtion-board",
        "intervals": "days",
        "assignment": "projects"
      }
    },
    {
      "name": "Invalid identifier 3",
      "data": {
        "priorities": 5,
        "name": "Week issues",
        "identifier": "ta",
        "intervals": "days",
        "assignment": "projects"
      }
    },
    {
      "name": "Invalid name",
      "data": {
        "priorities": 5,
        "name": "te",
        "identifier": "test-validation-board",
        "intervals": "days",
        "assignment": "projects"
      }
    },
    {
      "name": "Missing name",
      "data": {
        "priorities": 5,
        "identifier": "test-validation-board",
        "intervals": "days",
        "assignment": "projects"
      }
    },
    {
      "name":  "Missing priorities",
      "data": {
        "name": "Week issues",
        "identifier": "test-validation-board",
        "intervals": "weeks",
        "assignment": "issues"
      }
    },
    {
      "name":  "Missing assignment",
      "data": {
        "name": "Week issues",
        "priorities": 5,
        "identifier": "test-validation-board",
        "intervals": "weeks"
      }
    }
  ]
}