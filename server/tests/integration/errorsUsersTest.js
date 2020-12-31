/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */

const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")

const testValidation = require("./data/validation.users.js")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

let user = null

describe("Integration tests: User routes errors", () => {
  before(async function() {
    user = await User.findOne({ email: keys.testUserAdminGmail })
    app.request.user = user
  })

  it("Test: Get not existent", (done) => {
    chai.request(app)
      .get(`/api/users/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Get with invalid id", (done) => {
    chai.request(app)
      .get(`/api/users/<asadsa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Post existing user", (done) => {
    chai.request(app)
      .post(`/api/users`)
      .set("content-type", "application/json")
      .send(user)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  describe(testValidation.name, () => {
    for (const test of testValidation.tests) {
      it(`Test: ${test.name}`, (done) => {
        const { data } = test
        data.credentials = user.credentials
        chai.request(app)
          .post("/api/users")
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
    app.request.user = undefined
  })
})