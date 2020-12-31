process.env.DEBUG = "mongo-seeding"
const { Seeder } = require("mongo-seeding")
const path = require("path")

const keys = require("../config/keys")

const config = {
  database: keys.mongoURI,
  dropDatabase: true
}

if (!keys.testUserAdminGmail) {
  throw new Error("No TEST_ADMIN_GMAIL variable set. Need admin gmail in config. See config/keys/<enviroment>.js file")
}

if (!keys.testCredentialsRedmineUrl || !keys.testCredentialsRedmineApiKey) {
  throw new Error("No default credentials given. Can't create seeds without" +
    "test credentials configuration (Redmine test url and apiKey). See config/keys/<enviroment>.js file"
  )
}

const seeder = new Seeder(config)
const collections = seeder.readCollectionsFromPath(path.resolve(__dirname, "./seeds"))

seeder.import(collections)
  .then(() => console.info("Test data were successfully inserted"))
  .catch((error) => console.error("ERROR DURING SEEDING: ", error))

