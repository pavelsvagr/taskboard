const { getObjectId } = require("mongo-seeding")

const AES = require("crypto-js/aes")
const credentialTypes = require("../../../../shared/constants/credentialTypes")
const keys = require("../../../config/keys")

module.exports = {
  "_id": getObjectId("5fca8bee9bfaac213c3d3ce2"),
  "name": "Redmine test",
  "url": keys.testCredentialsRedmineUrl,
  "type": credentialTypes.Redmine,
  "apiKey": AES.encrypt("3f8b8fb8672f4ebf0253f1f794bc7ef735adb8f2", keys.encryptPassphrase).toString(),
  "creator": getObjectId("5fca8a0a0590df4704d998e8")
}