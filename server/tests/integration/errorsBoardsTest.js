/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */

const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")

const testValidation = require("./data/validation.boards.js")

const { prepareTestBoard, cleanTestBoard } = require("../helpers/prepareTestBoard")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

let user
let board

describe("Integration tests: Board routes errors", () => {
  before(async function() {
    user = await User.findOne({ email: keys.testUserAdminGmail })
    board = await prepareTestBoard(user, false)
    app.request.user = user
  })

  it("Test: Get not existent", (done) => {
    chai.request(app)
      .get(`/api/boards/notvalid`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Get with invalid identifier", (done) => {
    chai.request(app)
      .get(`/api/boards/<asadsa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Post existing board", (done) => {
    chai.request(app)
      .post(`/api/boards`)
      .set("content-type", "application/json")
      .send(board)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Delete board", (done) => {
    chai.request(app)
      .delete(`/api/boards/${board.identifier}`)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it("Test: Repeat delete board", (done) => {
    chai.request(app)
      .delete(`/api/boards/${board.identifier}`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  describe(testValidation.name, () => {
    for (const test of testValidation.tests) {
      it(`Test: ${test.name}`, (done) => {
        const { data } = test
        data.credentials = board.credentials
        chai.request(app)
          .post("/api/boards")
          .set("content-type", "application/json")
          .send(data)
          .end((error, res) => {
            res.should.have.status(404)
            done()
          })
      })
    }
  })
  after(async function() {
    cleanTestBoard()
    app.request.user = undefined
  })
})