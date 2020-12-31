const passport = require("passport")
const { URL_API_NAMESPACE } = require("../../../shared/constants/http")
const { TACTIC_GOOGLE } = require("../../../shared/constants/auth")

module.exports = (app) => {
  // Authenticate user with code
  app.get(
    "/auth/google",
    passport.authenticate(TACTIC_GOOGLE, {
      scope: ["profile", "email"]
    })
  )

  app.get(
    `${URL_API_NAMESPACE}/auth/errors`,
    (req, res) => {
      const error = req.session.authError
      delete req.session.authError
      return res.send(error)
    }
  )

  // Authenticate user
  app.get(
    "/auth/google/callback",
    passport.authenticate(TACTIC_GOOGLE, {
      failureRedirect: "/"
    }),
    (req, res) => {
      res.redirect("/boards")
    }
  )

  // Current user info
  app.get(`${URL_API_NAMESPACE}/user`, (req, res) => {
    res.send(req.user)
  })

  // Log-out
  app.get(`${URL_API_NAMESPACE}/logout`, (req, res) => {
    req.logout() // Passport automatically bind function
    res.redirect("/")
  })
}
