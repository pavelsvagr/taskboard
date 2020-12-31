/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")
const boardColors = require("../../../shared/constants/boardColors")
const { cleanTestBoard, prepareTestBoard } = require("../helpers/prepareTestBoard")
const { testTeam: boardTestTeam } = require("../helpers/prepareTestTeam")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

const testTeam = {
  name: "test-integration-team",
  identifier: "test-integration-team",
  color: boardColors[0]
}

let length = 0

describe("Integration tests: Teams endpoints", () => {
  before(async () => {
    // Treat user as test admin
    app.request.user = await User.findOne({ email: keys.testUserAdminGmail })
  })

  it("GET /teams Get all team records", function(done) {
    chai.request(app)
      .get("/api/teams")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        if (res.body.length) {
          res.body[0].should.be.a("object")
        }
        length = res.body.length // Save length of array for future tests

        done()
      })
  })

  it("POST /team Post new team", function(done) {
    chai.request(app)
      .post("/api/teams")
      .set("content-type", "application/json")
      .send(testTeam)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("identifier")
        res.body.should.have.property("color")
        res.body.name.should.be.equal(testTeam.name)
        res.body.identifier.should.be.equal(testTeam.identifier)
        res.body.color.should.be.equal(testTeam.color)

        testTeam._id = res.body._id // Save id for future tests

        done()
      })
  })

  it("GET /teams Get all teams after post", function(done) {
    chai.request(app)
      .get("/api/teams")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array").lengthOf(length + 1)
        done()
      })
  })

  it("PUT /teams/id/members Update members of the team", function(done) {
    chai.request(app)
      .put(`/api/teams/${testTeam.identifier}/members`)
      .set("content-type", "application/json")
      .send([app.request.user._id])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.have.lengthOf(1)
        res.body[0].should.be.a("object")
        res.body[0].should.have.property("_id")
        res.body[0].should.have.property("name")
        res.body[0].should.have.property("email")
        res.body[0].should.have.property("active")
        res.body[0].name.should.be.equal(app.request.user.name)
        res.body[0].email.should.be.equal(app.request.user.email)
        res.body[0].active.should.be.equal(app.request.user.active)
        done()
      })
  })

  it("GET /teams/id/members Get members of team", function(done) {
    chai.request(app)
      .get(`/api/teams/${testTeam.identifier}/members`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.have.lengthOf(1)
        res.body[0].should.be.a("object")
        res.body[0].should.have.property("_id")
        res.body[0].should.have.property("name")
        res.body[0].should.have.property("email")
        res.body[0].should.have.property("active")
        res.body[0].name.should.be.equal(app.request.user.name)
        res.body[0].email.should.be.equal(app.request.user.email)
        res.body[0].active.should.be.equal(app.request.user.active)
        done()
      })
  })

  it("PUT /teams/id/members Delete all members of a team", function(done) {
    chai.request(app)
      .put(`/api/teams/${testTeam.identifier}/members`)
      .set("content-type", "application/json")
      .send([])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array")
        res.body.should.have.lengthOf(0)
        done()
      })
  })

  it("DELETE /credentials/teams", function(done) {
    chai.request(app)
      .delete(`/api/teams/${testTeam.identifier}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("identifier")
        res.body.should.have.property("color")
        res.body.name.should.be.equal(testTeam.name)
        res.body.identifier.should.be.equal(testTeam.identifier)
        res.body.color.should.be.equal(testTeam.color)
        done()
      })
  })

  describe("Subsection: Board Teams", () => {
    let testBoard
    before(async () => {
      testBoard = await prepareTestBoard(app.request.user._id, true)
    })

    it("GET /boards/id/teams Get all teams for board", function(done) {
      chai.request(app)
        .get(`/api/boards/${testBoard.identifier}/teams`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.to.be.a("array")
          res.body.should.have.lengthOf(1)
          res.body[0].should.be.a("object")
          res.body[0].should.have.property("_id")
          res.body[0].should.have.property("name")
          res.body[0].should.have.property("identifier")
          res.body[0].should.have.property("members")
          res.body[0].name.should.be.equal(boardTestTeam.name)
          res.body[0].identifier.should.be.equal(boardTestTeam.identifier)
          res.body[0].members.should.have.lengthOf(1)
          done()
        })
    })

    it("PUT /boards/id/teams/id/members Update members of board team", function(done) {
      chai.request(app)
        .put(`/api/boards/${testBoard.identifier}/teams/${boardTestTeam.identifier}/members`)
        .set("content-type", "application/json")
        .send([])
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.to.be.a("array")
          res.body.should.have.lengthOf(0)
          done()
        })
    })

    it("GET /boards/id/teams Get all teams for board after update", function(done) {
      chai.request(app)
        .get(`/api/boards/${testBoard.identifier}/teams`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.to.be.a("array")
          res.body.should.have.lengthOf(1)
          res.body[0].should.be.a("object")
          res.body[0].name.should.be.equal(boardTestTeam.name)
          res.body[0].identifier.should.be.equal(boardTestTeam.identifier)
          res.body[0].members.should.have.lengthOf(0)
          done()
        })
    })


    after(async () => {
      return cleanTestBoard()
    })
  })

  after(async () => {
    app.request.user = undefined
  })
})