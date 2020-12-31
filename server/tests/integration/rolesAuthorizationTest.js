/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")
const roleTests = require("./data/roles.access")
const { prepareTestBoard, cleanTestBoard } = require("../helpers/prepareTestBoard")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

let user = null

function testSuccessResponse(res) {
  res.should.have.not.status(403)
}

function testErrorResponse(res) {
  res.should.have.status(403)
}

const testGetEndpoint = (endpoint, test) => (done) => {
  chai.request(app)
    .get(endpoint)
    .end((err, res) => {
      test(res)
      done()
    })
}

const testPostEndpoint = (endpoint, test) => (done) => {
  chai.request(app)
    .post(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      test(res)
      done()
    })
}

const testPutEndpoint = (endpoint, test) => (done) => {
  chai.request(app)
    .put(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      test(res)
      done()
    })
}

const testPatchEndpoint = (endpoint, test) => (done) => {
  chai.request(app)
    .patch(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      test(res)
      done()
    })
}

const testDeleteEndpoint = (endpoint, test) => (done) => {
  chai.request(app)
    .delete(endpoint)
    .end((err, res) => {
      test(res)
      done()
    })
}

describe("Integration tests: Role access", () => {
  before(async function() {
    user = await User.findOne({ email: keys.testUserAdminGmail })
    await prepareTestBoard(user, false, false)
  })

  // Create test for each role
  for (const roleTest of roleTests) {
    describe(`Role: ${roleTest.role}`, () => {
      before(async function() {
        user.role = roleTest.role
        app.request.user = user
      })

      // Test authorized endpoints
      describe(`Valid access`, () => {
        const test = testSuccessResponse
        for (const endpoint of roleTest.success.get) {
          it(`GET ${endpoint}`, testGetEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.success.post) {
          it(`POST ${endpoint}`, testPostEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.success.patch) {
          it(`PATCH ${endpoint}`, testPatchEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.success.put) {
          it(`PUT ${endpoint}`, testPutEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.success.delete) {
          it(`DELETE ${endpoint}`, testDeleteEndpoint(endpoint, test))
        }
      })
      // Test unauthorized endpoints
      describe(`Invalid access`, () => {
        const test = testErrorResponse
        for (const endpoint of roleTest.error.get) {
          it(`GET ${endpoint}`, testGetEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.error.post) {
          it(`POST ${endpoint}`, testPostEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.error.patch) {
          it(`PATCH ${endpoint}`, testPatchEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.error.put) {
          it(`PUT ${endpoint}`, testPutEndpoint(endpoint, test))
        }
        for (const endpoint of roleTest.error.delete) {
          it(`DELETE ${endpoint}`, testDeleteEndpoint(endpoint, test))
        }
      })
    })
  }

  after(async function() {
    await cleanTestBoard()
    app.request.user = undefined
  })
})