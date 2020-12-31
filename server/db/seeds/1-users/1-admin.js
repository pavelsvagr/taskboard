const { getObjectId } = require("mongo-seeding")

const roles = require("../../../../shared/security/roles")
const keys = require("../../../config/keys")

module.exports = {
  "_id": getObjectId("5fca8a0a0590df4704d998e8"),
  "email": keys.testUserAdminGmail,
  "name": 'TEST ADMIN',
  "role": roles.Admin,
  "active": true
}