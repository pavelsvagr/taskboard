const mongoose = require("mongoose")

const UserModel = require("../../app/model/models/User")

const User = mongoose.model(UserModel.SCHEMA)

async function prepareTestUser(name, email) {
  const exists = await User.findOne({email})
  if (exists) {
    return exists
  }

  const user = new User({name, email, role: 'admin'})
  return user.save()
}

async function cleanTestUser(email) {
  await User.deleteOne({email})
}

module.exports = {
  prepareTestUser,
  cleanTestUser
}