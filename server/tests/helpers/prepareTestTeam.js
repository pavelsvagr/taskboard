const mongoose = require("mongoose")

const TeamModel = require("../../app/model/models/Team")

const Team = mongoose.model(TeamModel.SCHEMA)

const testTeam = {
  name: 'test-team',
  identifier: 'test-team'
}


async function prepareTestTeam(owner) {
  const team = new Team(testTeam)
  team.users = [owner]
  return team.save()
}

async function cleanTestTeam() {
  await Team.deleteOne({identifier: testTeam.identifier})
}

module.exports = {
  testTeam,
  cleanTestTeam,
  prepareTestTeam
}