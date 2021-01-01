/* eslint func-names: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const boardRoles = require("../../../shared/security/rolesBoard")
const app = require("../../index")
const keys = require("../../config/keys")
const intervalsTypes = require("../../../shared/constants/intervalsTypes")
const assignmentsTypes = require("../../../shared/constants/assignmentTypes")
const { cleanTestCredentials, prepareTestCredentials } = require("../helpers/prepareTestCredentials")
const { prepareTestTeam, cleanTestTeam } = require("../helpers/prepareTestTeam")
const { prepareTestUser, cleanTestUser } = require("../helpers/prepareTestUser")

// Configure chai
chai.use(chaiHttp)
chai.should()

const testBoard = {
  name: "test-integration-board",
  identifier: "test-integration-board",
  credentials: null,
  priorities: 3,
  assignment: assignmentsTypes.projects,
  intervals: intervalsTypes.weeks
}

let length = 0
let user = null
let team = null
let member = {
  nickname: null,
  order: 1,
  role: boardRoles.Owner,
  user: null
}
const testAssignment = {
  title: "test-integration-task-1",
  id: "1",
  url: "https://test-link.com",
  type: "projects",
  priority: 1
}
const testItem = {
  date: "2020-11-09",
  assignments: [testAssignment]
}


function checkBoardBody(body) {
  body.should.to.be.a("object")
  body.should.have.property("_id")
  body.should.have.property("name")
  body.should.have.property("identifier")
  body.should.have.property("credentials")
  body.should.have.property("assignment")
  body.should.have.property("intervals")
  body.should.have.property("credentials")
  body.should.have.property("assignment")
  body.should.have.property("intervals")
  body.should.have.property("hasAvatars")
  body.should.have.property("hasInlineEdit")
  body.should.have.property("hasEmailNotifications")
}

function checkMember(body, comparison) {
  body.should.to.be.a("object")
  body.should.to.have.property("_id")
  body.should.to.have.property("nickname")
  body.should.to.have.property("order")
  body.should.to.have.property("role")
  body.should.to.have.property("user")
  body.user.should.to.have.property("_id")
  body.user.should.to.have.property("name")
  body.user.should.to.have.property("email")

  body.nickname.should.to.be.equal(comparison.nickname)
  body.order.should.to.be.equal(comparison.order)
  body.role.should.to.be.equal(comparison.role)

  body.user.email.should.to.be.equal(comparison.user.email)
  body.user.name.should.to.be.equal(comparison.user.name)
  body.user._id.should.to.be.equal(comparison.user._id.toString())
}

function checkBoardItem(body, comparison) {
  body.should.to.be.a("object")
  body.should.to.have.property("date")
  body.should.to.have.property("member")
  body.should.to.have.property("assignments")
  body.assignments.should.to.be.a("array")
  body.assignments.should.to.have.lengthOf(comparison.assignments.length)


  for (let i = 0; i < comparison.assignments.length; i += 1) {
    const firstComparison = comparison.assignments[i]
    const first = body.assignments[i]

    first.should.to.have.property("title")
    first.should.to.have.property("id")
    first.should.to.have.property("url")
    first.should.to.have.property("priority")

    first.title.should.be.equal(firstComparison.title)
    first.id.should.be.equal(firstComparison.id)
    first.url.should.be.equal(firstComparison.url)
    first.priority.should.be.equal(firstComparison.priority)
  }
}

describe("Integration tests: Boards endpoints", () => {
  before(async function() {
    this.timeout(5000)

    // Treat user as test admin
    user = await prepareTestUser('TEST', keys.testUserAdminGmail)
    app.request.user = user

    member.nickname = user.name
    member.user = user

    const credentials = await prepareTestCredentials(user)
    testBoard.credentials = credentials._id

    team = await prepareTestTeam(user)
  })

  it("GET /boards Get all boards records", function(done) {
    chai.request(app)
      .get("/api/boards")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property('limit')
        res.body.should.have.property('offset')
        res.body.should.have.property('count')
        res.body.data.should.to.be.a("array")
        if (res.body.data.length) {
          res.body.data[0].should.to.be.a('object')
        }
        length = res.body.count // Save length of array for future tests
        done()
      })
  })

  it("POST /boards Post new board", function(done) {
    chai.request(app)
      .post("/api/boards")
      .set("content-type", "application/json")
      .send(testBoard)
      .end((err, res) => {
        res.should.have.status(200)
        checkBoardBody(res.body)
        res.body.name.should.be.equal(testBoard.name)
        res.body.identifier.should.be.equal(testBoard.identifier)
        res.body.credentials.should.be.a("object")
        res.body.credentials._id.should.be.equal(testBoard.credentials.toString())

        testBoard._id = res.body._id // Save id for future tests
        done()
      })
  })

  it("GET /boards Get all boards after post", function(done) {
    chai.request(app)
      .get("/api/boards")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.data.should.to.be.a("array")
        res.body.count.should.to.be.equal(length + 1)
        done()
      })
  })

  it("GET /board/id Get conrete board", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}`)
      .end((err, res) => {
        res.should.have.status(200)
        checkBoardBody(res.body)
        res.body.name.should.be.equal(testBoard.name)
        res.body.identifier.should.be.equal(testBoard.identifier)
        res.body.credentials.should.be.a("object")
        res.body.credentials._id.should.be.equal(testBoard.credentials.toString())
        done()
      })
  })

  it("UPDATE /board/id Single updates on boards", function(done) {
    chai.request(app)
      .patch(`/api/boards/${testBoard.identifier}`)
      .set("content-type", "application/json")
      .send({
        name: "integration-test-board-2",
        priorities: 4
      })
      .end((err, res) => {
        res.should.have.status(200)
        checkBoardBody(res.body)
        res.body.name.should.be.equal("integration-test-board-2")
        res.body.priorities.should.be.equal(4)
        res.body.identifier.should.be.equal(testBoard.identifier)
        testBoard.name = "integration-test-board-2"
        testBoard.priorities = 4
        done()
      })
  })

  it("UPDATE /board/id Team updates on boards", function(done) {
    chai.request(app)
      .patch(`/api/boards/${testBoard.identifier}`)
      .set("content-type", "application/json")
      .send({
        name: testBoard.name,
        priorities: testBoard.priorities,
        teams: [team._id.toString()]
      })
      .end((err, res) => {
        res.should.have.status(200)
        checkBoardBody(res.body)
        res.body.name.should.be.equal(testBoard.name)
        res.body.priorities.should.be.equal(testBoard.priorities)
        res.body.identifier.should.be.equal(testBoard.identifier)
        done()
      })
  })

  // Settings
  it("GET /board/id/settings Check empty get settings", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/settings/2020-11-09`)
      .end((err, res) => {
        res.should.have.status(200)
        // eslint-disable-next-line no-unused-expressions
        res.body.should.to.be.a("object").that.is.empty
        done()
      })
  })

  it("PUT /board/id/settings Check send settings", function(done) {
    chai.request(app)
      .put(`/api/boards/${testBoard.identifier}/settings/2020-11-09`)
      .set("content-type", "application/json")
      .send({
        priorities: 1,
        deactivated: [user._id]
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        done()
      })
  })

  it("GET /board/id/settings Check new get settings", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/settings/2020-11-09`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        done()
      })
  })

  it("DELETE /board/id/settings Delete settings", function(done) {
    chai.request(app)
      .delete(`/api/boards/${testBoard.identifier}/settings/2020-11-09`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        done()
      })
  })

  it("GET /board/id/settings Check empty get settings", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/settings/2020-11-09`)
      .end((err, res) => {
        res.should.have.status(200)
        // eslint-disable-next-line no-unused-expressions
        res.body.should.to.be.a("object").that.is.empty
        done()
      })
  })

  // Members
  it("GET /board/id/members Get members of the board", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/members`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)
        checkMember(res.body[0], member)
        member = res.body[0]
        testItem.member = member._id

        done()
      })
  })

  it("PATCH /board/id/members Update single member of the board", function(done) {
    chai.request(app)
      .patch(`/api/boards/${testBoard.identifier}/members/${member._id}`)
      .set("content-type", "application/json")
      .send({ nickname: "test-integration-nickname" })
      .end((err, res) => {
        res.should.have.status(200)
        member.nickname = "test-integration-nickname"
        checkMember(res.body, member)
        done()
      })
  })

  it("PUT /board/id/members Delete members of the board", function(done) {
    chai.request(app)
      .put(`/api/boards/${testBoard.identifier}/members`)
      .set("content-type", "application/json")
      .send([])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(0)
        done()
      })
  })

  it("GET /board/id/members Get members after deleting them", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/members`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(0)
        done()
      })
  })

  it("PUT /board/id/members Replace members of the board", function(done) {
    const testNewMember = {...member}
    testNewMember.user = testNewMember.user._id

    chai.request(app)
      .put(`/api/boards/${testBoard.identifier}/members`)
      .set("content-type", "application/json")
      .send([testNewMember])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)
        checkMember(res.body[0], member)
        done()
      })
  })

  it("GET /board/id/members Get members of the board after creating", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/members`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)
        checkMember(res.body[0], member)
        done()
      })
  })

  // Items
  it("POST /board/id/items Add item", function(done) {
    chai.request(app)
      .post(`/api/boards/${testBoard.identifier}/items`)
      .set("content-type", "application/json")
      .send(testItem)
      .end((err, res) => {
        res.should.have.status(200)

        checkBoardItem(res.body, testItem)
        testItem._id = res.body._id

        done()
      })
  })

  it("GET /board/id/items Get all items for today expecting empty", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/items`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(0)
        done()
      })
  })

  it("GET /board/id/items Get all items for item day only", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/items?from=2020-11-09&to=2020-11-09`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)

        checkBoardItem(res.body[0], testItem)
        done()
      })
  })

  it("GET /board/id/items Get all items for item for month", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/items?from=2020-11-01&to=2020-11-30`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)

        checkBoardItem(res.body[0], testItem)
        done()
      })
  })

  it("PUT /board/id/items/id Update item", function(done) {
    testItem.assignments = []

    chai.request(app)
      .put(`/api/boards/${testBoard.identifier}/items/${testItem._id}`)
      .set("content-type", "application/json")
      .send(testItem)
      .end((err, res) => {
        res.should.have.status(200)

        checkBoardItem(res.body, testItem)

        done()
      })
  })

  it("GET /board/id/items Get all items after update with filters", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/items?from=2020-11-01&to=2020-11-30`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(1)

        checkBoardItem(res.body[0], testItem)
        done()
      })
  })


  it("DELETE /board/id/items/id Delete items for the whole year", function(done) {
    chai.request(app)
      .delete(`/api/boards/${testBoard.identifier}/items?dateFrom=2020-01-01&dateTo=2020-12-31`)
      .end((err, res) => {
        res.should.have.status(204)
        done()
      })
  })

  it("GET /board/id/items Get all items after delete", function(done) {
    chai.request(app)
      .get(`/api/boards/${testBoard.identifier}/items?from=2020-11-01&to=2020-11-30`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.to.have.lengthOf(0)
        done()
      })
  })

  it("DELETE /boards delete created board", function(done) {
    chai.request(app)
      .delete(`/api/boards/${testBoard.identifier}`)
      .end((err, res) => {
        res.should.have.status(200)

        checkBoardBody(res.body)
        res.body.name.should.be.equal(testBoard.name)
        res.body.identifier.should.be.equal(testBoard.identifier)
        done()
      })
  })

  it("GET /boards Get all boards after delete", function(done) {
    chai.request(app)
      .get("/api/boards")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.data.should.to.be.a("array").lengthOf(length)
        done()
      })
  })

  after(async () => {
    await cleanTestCredentials()
    await cleanTestTeam()
    await cleanTestUser(keys.testUserAdminGmail)
    app.request.user = undefined
  })
})