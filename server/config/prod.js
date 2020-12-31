module.exports = {
  // Google oAuth
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  cookieKey: process.env.COOKIE_KEY,

  // MongoDB
  mongoURI: process.env.MONGO_URI,

  // SendGrid
  sendGridKey: process.env.SEND_GRID_KEY,
  redirectDomain: process.env.REDIRECT_DOMAIN,
  fromEmail: process.env.FROM_EMAIL,
  // AWS
  awsKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
  awsBucketName: process.env.S3_BUCKET_NAME,
  // Security
  whitelistedEmails: process.env.EMAIL_WHITELIST,
  encryptPassphrase: process.env.ENCRYPT_PASSPHRASE,
  // Test data
  testCredentialsRedmineUrl: process.env.TEST_REDMINE_API_URL,
  testCredentialsRedmineApiKey: process.env.TEST_REDMINE_API_KEY,
  testUserAdminGmail: process.env.TEST_ADMIN_GMAIL,
}
