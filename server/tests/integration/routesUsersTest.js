/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const UserModel = require("../../app/model/models/User")
const roles = require("../../../shared/security/roles")

const User = mongoose.model(UserModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

const testUser = {
  name: "test-integration-user",
  email: "test-intergration@example.org",
  role: roles.User
}

let length = 0
let createdId = null

describe("Integration tests: Users endpoints", () => {
  before(async () => {
    // Treat user as test admin
    app.request.user = await User.findOne({ email: keys.testUserAdminGmail })
  })

  it("GET /users Get all user records", function(done) {
    chai.request(app)
      .get("/api/users")
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
  it("POST /users Post new user", function(done) {
    chai.request(app)
      .post("/api/users")
      .set("content-type", "application/json")
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("email")
        res.body.should.have.property("role")
        res.body.name.should.be.equal(testUser.name)
        res.body.email.should.be.equal(testUser.email)
        res.body.role.should.be.equal(testUser.role)

        createdId = res.body._id // Save id

        done()
      })
  })

  it("PATCH /user/id Update specific user", function(done) {
    chai.request(app)
      .patch(`/api/users/${createdId}`)
      .set("content-type", "application/json")
      .send({ name: 'test-user-2'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body.should.have.property("email")
        res.body.should.have.property("role")
        res.body._id.should.be.equal(createdId)
        res.body.name.should.be.equal('test-user-2')
        res.body.email.should.be.equal(testUser.email)
        res.body.role.should.be.equal(testUser.role)
        done()
      })
  })

  it("GET /user/id Get updated user", function(done) {
    chai.request(app)
      .get(`/api/users/${createdId}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property("_id")
        res.body.should.have.property("name")
        res.body._id.should.be.equal(createdId)
        res.body.name.should.be.equal('test-user-2')
        done()
      })
  })

  it("GET /users Get all users after post", function(done) {
    chai.request(app)
      .get("/api/users")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("array").lengthOf(length + 1)
        done()
      })
  })

  after(async () => {
    // Delete created test user
    await User.deleteOne({ email: testUser.email })

    app.request.user = undefined
  })
})