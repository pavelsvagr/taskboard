/* eslint func-names: 0 */
/* eslint import/no-extraneous-dependencies:0 */
const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const app = require("../../index")
const keys = require("../../config/keys")
const NotificationModel = require("../../app/model/models/Notification")
const notificationTypes = require("../../../shared/constants/notificationTypes")
const { prepareTestUser, cleanTestUser } = require("../helpers/prepareTestUser")

const Notification = mongoose.model(NotificationModel.SCHEMA)

// Configure chai
chai.use(chaiHttp)
chai.should()

let testNotification = {
  title: "test-integration-notification",
  type: notificationTypes.task,
  link: "test-link",
  linkText: "test-link",
  message: "test"
}

describe("Integration tests: Notifications endpoints", () => {
  before(async () => {
    // Treat user as test admin
    app.request.user = await prepareTestUser('TEST', keys.testUserAdminGmail)

    await Notification.deleteMany({})

    // Prepare test notification
    testNotification.user = app.request.user._id
    testNotification = await (new Notification(testNotification)).save()
  })

  it("GET /notifications/unread/count Get unread notifications", function(done) {
    chai.request(app)
      .get("/api/notifications/unread/count")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("count")
        res.body.count.should.be.equal(1)
        done()
      })
  })

  it("GET /notifications Get notifications", function(done) {
    chai.request(app)
      .get("/api/notifications")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.to.be.a("object")
        res.body.should.have.property('limit')
        res.body.should.have.property('offset')
        res.body.should.have.property('count')

        res.body.count.should.be.equal(1)

        res.body.data.should.to.be.a("array")
        res.body.data.should.to.have.lengthOf(1)
        res.body.data[0].should.be.a("object")
        res.body.data[0]._id.should.be.equal(testNotification._id.toString())
        res.body.data[0].title.should.be.equal(testNotification.title)
        res.body.data[0].link.should.be.equal(testNotification.link)
        res.body.data[0].message.should.be.equal(testNotification.message)
        done()
      })
  })

  it("GET /notifications/unread/count Get unread notifications after see unread", function(done) {
    chai.request(app)
      .get("/api/notifications/unread/count")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("count")
        res.body.count.should.be.equal(0)
        done()
      })
  })

  it("DELETE /notifications/id Delete prepared notification", function(done) {
    chai.request(app)
      .delete(`/api/notifications/${testNotification._id}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body._id.should.be.equal(testNotification._id.toString())
        res.body.title.should.be.equal(testNotification.title)
        res.body.link.should.be.equal(testNotification.link)
        res.body.message.should.be.equal(testNotification.message)
        done()
      })
  })

  it("GET /notifications Get all notifications after delete", function(done) {
    chai.request(app)
      .get("/api/notifications")
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have.property("count")
        res.body.count.should.be.equal(0)

        res.body.should.have.property("data")
        res.body.data.should.to.be.a("array")
        res.body.data.should.to.have.lengthOf(0)
        done()
      })
  })

  after(async () => {
    await cleanTestUser(keys.testUserAdminGmail)
    app.request.user = undefined
  })
})