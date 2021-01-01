/* eslint global-require: 0 */
// keys.js prod vs dev config
if (process.env.NODE_ENV === "production") {
  // Production mode
  module.exports = require("./prod")
} else {
  // Development mode
  module.exports = require("./dev")
}
