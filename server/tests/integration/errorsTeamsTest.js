/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */

const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../index")
const keys = require("../../config/keys")

const testValidation = require("./data/validation.teams.js")

const { prepareTestTeam, cleanTestTeam } = require("../helpers/prepareTestTeam")
const { prepareTestUser, cleanTestUser } = require("../helpers/prepareTestUser")

// Configure chai
chai.use(chaiHttp)
chai.should()

let user
let team

describe("Integration tests: Teams routes errors", () => {
  before(async function() {
    user = await prepareTestUser('TEST', keys.testUserAdminGmail)
    team = await prepareTestTeam(user, false)
    app.request.user = user
  })

  it("Test: Get not existent", (done) => {
    chai.request(app)
      .get(`/api/teams/notvalid`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Get with invalid identifier", (done) => {
    chai.request(app)
      .get(`/api/teams/<asadsa`)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Post existing team", (done) => {
    chai.request(app)
      .post(`/api/teams`)
      .set("content-type", "application/json")
      .send(team)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it("Test: Delete team", (done) => {
    chai.request(app)
      .delete(`/api/teams/${team.identifier}`)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it("Test: Repeat delete team", (done) => {
    chai.request(app)
      .delete(`/api/teams/${team.identifier}`)
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
          .post("/api/teams")
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
    await cleanTestTeam()
    await cleanTestUser(keys.testUserAdminGmail)
    app.request.user = undefined
  })
})