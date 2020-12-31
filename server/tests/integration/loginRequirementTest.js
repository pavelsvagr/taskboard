/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../index")


// Configure chai
chai.use(chaiHttp)
chai.should()

const endpoints = {
  get: [
    "/api/notifications/stream",
    "/api/notifications",
    "/api/notifications/unread/count",
    "/api/users",
    "/api/boards",
    "/api/teams",
    "/api/credentials"
  ],
  post: [
    "/api/boards",
    "/api/boards/id/items",
    "/api/credentials",
    "/api/teams",
    "/api/users",
  ],
  patch: [
    "/api/boards/id",
    "/api/credentials/id",
    "/api/boards/id/members/id",
  ],
  put: [
    "/api/boards/id/settings/date",
    "/api/boards/id/items/id",
    "/api/boards/id/members",
    "/api/boards/id/teams/id/members",
  ],
  delete: [
    "/api/boards/id",
    "/api/credentials/id",
    "/api/teams/id",
    "/api/boards/id/items",
    "/api/boards/id/settings/date",
  ]
}

function testResponse(res) {
  res.should.have.status(401)

  // eslint-disable-next-line no-unused-expressions
  res.body.should.be.a("object")
  res.body.should.to.have.property("errors")
  res.body.errors.should.be.a("object")
  res.body.errors.type.should.be.equal("auth")
}

const testGetEndpoint = (endpoint) => (done) => {
  chai.request(app)
    .get(endpoint)
    .end((err, res) => {
      testResponse(res)
      done()
    })
}

const testPostEndpoint = (endpoint) => (done) => {
  chai.request(app)
    .post(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      testResponse(res)
      done()
    })
}

const testPutEndpoint = (endpoint) => (done) => {
  chai.request(app)
    .put(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      testResponse(res)
      done()
    })
}

const testPatchEndpoint = (endpoint) => (done) => {
  chai.request(app)
    .patch(endpoint)
    .set("content-type", "application/json")
    .send({})
    .end((err, res) => {
      testResponse(res)
      done()
    })
}

const testDeleteEndpoint = (endpoint) => (done) => {
  chai.request(app)
    .delete(endpoint)
    .end((err, res) => {
      testResponse(res)
      done()
    })
}

describe("Integration tests: Login errors", () => {
  describe("GET", () => {
    for (const endpoint of endpoints.get) {
      it(endpoint, testGetEndpoint(endpoint))
    }
  })
  describe("POST", () => {
    for (const endpoint of endpoints.post) {
      it(endpoint, testPostEndpoint(endpoint))
    }
  })
  describe("PATCH", () => {
    for (const endpoint of endpoints.patch) {
      it(endpoint, testPatchEndpoint(endpoint))
    }
  })
  describe("PUT", () => {
    for (const endpoint of endpoints.put) {
      it(endpoint, testPutEndpoint(endpoint))
    }
  })
  describe("DELETE", () => {
    for (const endpoint of endpoints.delete) {
      it(endpoint, testDeleteEndpoint(endpoint))
    }
  })
})