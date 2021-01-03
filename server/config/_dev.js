// temporary dev file, remove underscore in name and set values for dev
module.exports = {
  /** Google oAuth setup */
  googleClientID: "", // Client ID
  googleClientSecret: "", // Client Secret

  /** Database MongoDB connection */
  mongoURI: "", // Mongo URI

  /** SendGrid emails sender */
  sendGridKey: "", // SendGrid API key
  redirectDomain: "", // Redirect domain for email links to your app. (Root URL of your application).
  fromEmail: "", // SendGrid fromEmail send in email notifications.

  /** Security */
  // Cookie key (your secret)
  cookieKey: "",
  // AES encryption (your secret)
  encryptPassphrase:"",
  // All emails with this domain will be whitelisted and their role will be set to moderator.
  // Use comma separator. For example: "gmail.com,google.com".
  whitelistedEmailsMod:"",
  // All emails with this domain will be whitelisted and their role will be set to Admin.
  // Use comma separator. For example: "gmail.com,google.com".
  whitelistedEmailsAdmin: "",

  /** Test data for seeding and testing */
  testCredentialsRedmineUrl: "",
  testCredentialsRedmineApiKey: "",
  testUserAdminGmail: "",
}
