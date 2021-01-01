const mongoose = require("mongoose")

const BoardModel = require("../../app/model/models/Board")
const BoardTeamModel = require("../../app/model/models/BoardTeam")
const MemberModel = require("../../app/model/models/Member")
const intervalsTypes = require("../../../shared/constants/intervalsTypes")
const boardRoles = require("../../../shared/security/rolesBoard")
const assignmentsTypes = require("../../../shared/constants/assignmentTypes")
const {prepareTestCredentials, cleanTestCredentials} = require("./prepareTestCredentials")
const {prepareTestTeam, cleanTestTeam} = require("./prepareTestTeam")

const Board = mongoose.model(BoardModel.SCHEMA)
const BoardTeam = mongoose.model(BoardTeamModel.SCHEMA)
const Member = mongoose.model(MemberModel.SCHEMA)

const testBoard = {
  identifier: 'test-board',
  name: 'test-board',
  assignment: assignmentsTypes.projects,
  intervals: intervalsTypes.weeks,
}

async function prepareTestBoard(owner, useTeam = false, addOwner = true) {
  const credentials = await prepareTestCredentials(owner)

  let board = new Board(testBoard)
  board.credentials = credentials._id
  board.owner = owner
  board = await board.save()


  let createdMember = null
  if (addOwner) {
    const member = new Member()
    member.board = board._id
    member.user = owner._id
    member.order = 1
    member.role = boardRoles.Owner
    createdMember = await member.save()
  }

  if (useTeam) {
    const createdTeam = await prepareTestTeam()

    const boardTeam = new BoardTeam()
    boardTeam.team = createdTeam._id
    boardTeam.board = board._id
    boardTeam.members = createdMember ? [createdMember._id] : []
    await boardTeam.save()
  }

  return board
}

async function cleanTestBoard() {
  const board = Board.findOne({identifier: 'test-board'})

  await Member.deleteMany({board: board._id})
  await BoardTeam.deleteMany({board: board._id})
  await Board.deleteOne({identifier: 'test-board'})
  await cleanTestTeam()
  await cleanTestCredentials()
}

module.exports = {
  testBoard,
  cleanTestBoard,
  prepareTestBoard
}