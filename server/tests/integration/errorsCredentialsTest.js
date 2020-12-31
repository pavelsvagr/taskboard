/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */

const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")

const testValidation = require("./data/validation.credentials.js")

const { prepareTestCredentials, cleanTestCredentials } = require("../helpers/prepareTestCredentials")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

let user
let credentials

describe("Integration tests: Credentials routes errors", () => {
  before(async function() {
    user = await User.findOne({ email: keys.testUserAdminGmail })
    credentials = await prepareTestCredentials(user)
    app.request.user = user
  })

  it("Test: Get not existent", (done) => {
    chai.request(app)
      .get(`/api/credentials/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Get with invalid id", (done) => {
    chai.request(app)
      .get(`/api/credentials/<asadsa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Delete credentials", (done) => {
    chai.request(app)
      .delete(`/api/credentials/${credentials._id}`)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it("Test: Repeat delete board", (done) => {
    chai.request(app)
      .delete(`/api/credentials/${credentials._id}`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  describe(testValidation.name, () => {
    for (const test of testValidation.tests) {
      it(`Test: ${test.name}`, (done) => {
        const { data } = test
        chai.request(app)
          .post("/api/credentials")
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
    cleanTestCredentials()
    app.request.user = undefined
  })
})