/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../index")
const keys = require("../../config/keys")
const credentialsTypes = require("../../../shared/constants/credentialTypes")
const { prepareTestUser, cleanTestUser } = require("../helpers/prepareTestUser")

// Configure chai
chai.use(chaiHttp)
chai.should()

const testCredentials = {
  name: "test-integration-credentials",
  url: keys.testCredentialsRedmineUrl,
  type: credentialsTypes.Redmine,
  apiKey: keys.testCredentialsRedmineApiKey
}

let length = 0
let createdId = null

describe("Integration tests: Credentials endpoints", () => {
  before(async () => {
    // Treat user as test admin
    app.request.user = await prepareTestUser('TEST', keys.testUserAdminGmail)
  })

  it("GET /credentials Get all credentials records", function(done) {
    chai.request(app)
      .get("/api/credentials")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('limit')
        res.body.should.have.property('offset')
        res.body.should.have.property('count')
        res.body.data.should.to.be.a("array")
        if (res.body.data.length) {
          res.body.data[0].should.be.a("object")
        }

        length = res.body.count // Save length of array for future tests

        done()
      })
  })
  it("POST /credentials Post new credentials", function(done) {
    this.timeout(10000) // External api response

    chai.request(app)
      .post("/api/credentials")
      .set("content-type", "application/json")
      .send(testCredentials)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.not.have.property("apiKey")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("type")
        res.body.should.have.property("url")
        res.body.name.should.be.equal(testCredentials.name)
        res.body.url.should.be.equal(testCredentials.url)
        res.body.type.should.be.equal(testCredentials.type)

        createdId = res.body._id // Save id

        done()
      })
  })
  it("GET /credentials Get all credentials after post", function(done) {
    chai.request(app)
      .get("/api/credentials")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.data.should.to.be.a("array")
        res.body.count.should.to.be.equal(length + 1)
        done()
      })
  })
  it("DELETE /credentials/id", function(done) {
    chai.request(app)
      .delete(`/api/credentials/${createdId}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.not.have.property("apiKey")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("type")
        res.body.should.have.property("url")
        res.body._id.should.be.equal(createdId)
        res.body.name.should.be.equal(testCredentials.name)
        res.body.url.should.be.equal(testCredentials.url)
        res.body.type.should.be.equal(testCredentials.type)
        done()
      })
  })

  after(async () => {
    await cleanTestUser(keys.testUserAdminGmail)
    app.request.user = undefined
  })
})