const mongoose = require("mongoose")

const MongooseRepository = require("./MongooseRepository")

const CredentialsModel = require("../models/Credentials")

const Credentials = mongoose.model(CredentialsModel.SCHEMA)

module.exports = new MongooseRepository(Credentials)
