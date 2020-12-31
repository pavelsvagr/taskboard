const roles = require("../../../../shared/security/roles")
const {testBoard} = require("../../helpers/prepareTestBoard")

module.exports = [
  {
    role: roles.User,
    success: {
      get: [
        "/api/notifications",
        "/api/notifications/unread/count",
        "/api/boards",
        "/api/teams"
      ],
      post: [],
      patch: [],
      put: [],
      delete: [
        "/api/notifications/id"
      ]
    },
    error: {
      get: [
        "/api/users",
        "/api/users/id",
        "/api/credentials"
      ],
      post: [
        "/api/boards",
        `/api/boards/${testBoard.identifier}/items`,
        "/api/credentials",
        "/api/teams",
        "/api/users"
      ],
      patch: [
        `/api/boards/${testBoard.identifier}`,
        "/api/credentials/id",
        `/api/boards/${testBoard.identifier}/members/id`
      ],
      put: [
        `/api/boards/${testBoard.identifier}/settings/date`,
        `/api/boards/${testBoard.identifier}/items/id`,
        `/api/boards/${testBoard.identifier}/members`,
        `/api/boards/${testBoard.identifier}/teams/id/members`
      ],
      delete: [
        `/api/boards/${testBoard.identifier}`,
        "/api/credentials/id",
        "/api/teams/id",
        `/api/boards/${testBoard.identifier}/items`,
        `/api/boards/${testBoard.identifier}/settings/date`
      ]
    }
  },
  {
    role: roles.Mod,
    success: {
      get: [
        "/api/notifications",
        "/api/notifications/unread/count",
        "/api/boards",
        "/api/teams",
        "/api/users",
        "/api/credentials"
      ],
      post: [
        "/api/boards",
        `/api/boards/${testBoard.identifier}/items`,
        "/api/teams",
      ],
      patch: [
        `/api/boards/${testBoard.identifier}`,
        "/api/teams/id",
        `/api/boards/${testBoard.identifier}/items`,
        `/api/boards/${testBoard.identifier}/settings/date`
      ],
      put: [
        `/api/boards/${testBoard.identifier}/settings/date`,
        `/api/boards/${testBoard.identifier}/items/id`,
        `/api/boards/${testBoard.identifier}/members`,
        `/api/boards/${testBoard.identifier}/teams/id/members`
      ],
      delete: [
        "/api/notifications/id"
      ]
    },
    error: {
      get: [
        "/api/users/id"
      ],
      post: [
        "/api/users",
        "/api/credentials",
      ],
      patch: [
        "/api/credentials/id",
        "/api/users/id"
      ],
      put: [],
      delete: []
    }
  },
  {
    role: roles.Admin,
    success: {
      get: [
        "/api/notifications",
        "/api/notifications/unread/count",
        "/api/boards",
        "/api/teams",
        "/api/users",
        "/api/credentials",
        "/api/users/id"
      ],
      post: [
        "/api/boards",
        `/api/boards/${testBoard.identifier}/items`,
        "/api/credentials",
        "/api/teams",
        "/api/users",
        "/api/users/id"
      ],
      patch: [
        `/api/boards/${testBoard.identifier}`,
        "/api/credentials/id",
        "/api/teams/id",
        `/api/boards/${testBoard.identifier}/items`,
        `/api/boards/${testBoard.identifier}/settings/date`,
        "/api/users/id"
      ],
      put: [
        `/api/boards/${testBoard.identifier}/settings/date`,
        `/api/boards/${testBoard.identifier}/items/id`,
        `/api/boards/${testBoard.identifier}/members`,
        `/api/boards/${testBoard.identifier}/teams/id/members`
      ],
      delete: [
        "/api/notifications/id"
      ]
    },
    error: {
      get: [],
      post: [],
      patch: [],
      put: [],
      delete: []
    }
  }
]