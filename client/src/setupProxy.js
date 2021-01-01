const { createProxyMiddleware } = require("http-proxy-middleware")
const {
  PORT_DEFAULT,
  URL_API_NAMESPACE,
} = require("../../shared/constants/http")

// Registers middleware for redirect to our apps in dev mode
module.exports = (app) => {
  app.use(
    // redirect api and auth urls to our server
    [URL_API_NAMESPACE, "/auth/google", "/profiles"],
    createProxyMiddleware({
      target: `http://localhost:${PORT_DEFAULT}`,
      headers: {
        Connection: "keep-alive",
        "Cache-Control": "no-transform",
      },
    })
  )
}
