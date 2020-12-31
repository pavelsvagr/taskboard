const { getObjectId } = require("mongo-seeding")

module.exports = [
  {
    "_id": getObjectId("5fccb173157b8044dc165b43"),
    "priorities": 4,
    "hasAvatars": true,
    "hasEmailNotifications": false,
    "hasInlineEdit": false,
    "name": "Week issues",
    "identifier": "week-issues-table",
    "credentials": getObjectId("5fca8bee9bfaac213c3d3ce2"),
    "intervals": "weeks",
    "assignment": "issues",
    "apiFilters": null,
    "owner": getObjectId("5fca8a0a0590df4704d998e8")
  },
  {
    "_id": getObjectId("5fccb18a157b8044dc165b49"),
    "priorities": 2,
    "hasAvatars": false,
    "hasEmailNotifications": false,
    "hasInlineEdit": true,
    "name": "Compact daily table with task filters",
    "identifier": "compact-daily",
    "credentials": getObjectId("5fca8bee9bfaac213c3d3ce2"),
    "intervals": "days",
    "assignment": "projects",
    "apiFilters": [
      {
        "name": "parent_id",
        "value": "!*"
      },
      {
        "name": "status",
        "value": "1"
      }
    ],
    "owner": getObjectId("5fca8a0a0590df4704d998e8")
  },
  {
    "_id": getObjectId("5fccb1b9157b8044dc165b4f"),
    "priorities": 3,
    "hasAvatars": true,
    "hasEmailNotifications": false,
    "hasInlineEdit": false,
    "name": "Month projects for one team",
    "identifier": "month-one-team",
    "credentials": getObjectId("5fca8bee9bfaac213c3d3ce2"),
    "intervals": "months",
    "assignment": "projects",
    "apiFilters": null,
    "owner": getObjectId("5fca8a0a0590df4704d998e8")
  }
]