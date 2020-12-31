const RedmineConnector = require("./RedmineConnector")

/**
 * Creates external API connector for given credentials and type of app
 * @param {string} type
 * @param {string} url
 * @param {string} apiKey
 * @return {RedmineConnector | null}
 */
exports.createApiConnector = (type, url, apiKey) => {
  switch (type) {
    case "redmine":
      return new RedmineConnector(url, apiKey)
    // Add more connectors in future if needed
    default:
  }
  return null
}
