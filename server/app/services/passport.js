const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

const keys = require("../../config/keys")
const userManager = require("./managers/userManager")
const securityManager = require("./managers/securityManager")
const AuthenticationError = require("../exceptions/AuthorizationError")

// User serialization for cookie
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// User deserialization from cookie
passport.deserializeUser(async (token, done) => {
  const user = await userManager.getUser(token)
  done(null, user)
})

// Google authorization
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
      proxy: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await securityManager.loginByGoogle(profile)
        delete req.session.authError
        done(null, user)
      } catch (err) {
        if (err instanceof AuthenticationError) {
          req.session.authError = { message: err.message }
          done(null, null)
        } else {
          throw err
        }
      }
    }
  )
)
