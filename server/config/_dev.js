// temporary dev file, remove underscore in name and set values for dev
module.exports = {
  // OAuth2 google API keys
  googleClientID: "",
  googleClientSecret: "",

  // DB connection
  mongoURI: "",

  // Cookies
  cookieKey: "",

  // Email sender
  sendGridKey: "",
  redirectDomain: "",
  fromEmail: "",

  // Security
  encryptPassphrase:"", // AES encryption
  whitelistedEmails:"", // All emails with this domain will be whitelisted. Use comma separator. For example: "gmail.com,google.com"

  // Test data
  testCredentialsRedmineUrl: "",
  testCredentialsRedmineApiKey: "",
  testUserAdminGmail: "",
}
