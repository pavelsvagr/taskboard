const sendgrid = require("sendgrid")

const helper = sendgrid.mail
const keys = require("../../../config/keys")

/**
 * Sendgrid Mailer service for sending mails through sendgrid API
 */
class Mailer extends helper.Mail {
  /**
   *
   * @param subject
   * @param emails
   * @param content
   */
  constructor(subject, emails, content) {
    super()

    this.sgApi = sendgrid(keys.sendGridKey)
    this.from_email = new helper.Email(keys.fromEmail)
    this.subject = subject
    this.body = new helper.Content("text/html", content)
    this.to = emails.map((email) => new helper.Email(email))

    this.addContent(this.body)
    this.addClickTracking()
    this.addTo(this.to)
  }

  /**
   *
   */
  addClickTracking() {
    const settings = new helper.TrackingSettings()
    const clickTracking = new helper.ClickTracking(true, true)
    settings.setClickTracking(clickTracking)
    this.addTrackingSettings(settings)
  }

  /**
   *
   * @param emails
   */
  addTo(emails) {
    const personalize = new helper.Personalization()
    emails.forEach((email) => {
      personalize.addTo(email)
    })

    this.addPersonalization(personalize)
  }

  /**
   *
   * @returns {Promise<SendGrid.Rest.Response>}
   */
  async send() {
    const req = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON()
    })

    return this.sgApi.API(req)
  }
}

module.exports = Mailer
