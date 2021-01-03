const { downloadImage } = require("../downloader")
const keys = require("../../../config/keys")
const userRepository = require("../../model/repositories/UserRepository")
const AuthenticationError = require("../../exceptions/AuthorizationError")
const Role = require("../../../../shared/security/roles")
const User = require("../../model/entities/User")


const checkWhitelist = async (whitelist, googleId, fullName, email, role) => {
  for (const emailEnding of whitelist.split(',')) {
    if (email.endsWith(`@${emailEnding}`)) {
      // User is whitelisted, give it base permission and create him
      return userRepository.create(
        new User(googleId, email, null, null, fullName, role, true)
      )
    }
  }
  return null
}

/**
 * @param {object} profile
 * @return {Promise<any>}
 */
exports.loginByGoogle = async (profile) => {
  const { id: googleId, emails, displayName: fullName, photos } = profile

  let user = await userRepository.findByGoogleId(googleId)
  if (!emails.length > 0) {
    throw new AuthenticationError(
      "Google auth missing email or unknown profile structure."
    )
  }
  const email = emails[0].value
  if (!user) {
    user = await userRepository.findByEmail(email)
    if (!user && keys.whitelistedEmailsAdmin) {
      user = await checkWhitelist(keys.whitelistedEmailsAdmin, googleId, fullName, email, Role.Admin)
    }
    if (!user && keys.whitelistedEmailsMod) {
      user = await checkWhitelist(keys.whitelistedEmailsMod, googleId, fullName, email, Role.Mod)
    }
  }
  if (!user) {
    throw new AuthenticationError("This email is not whitelisted.")
  }
  if (!user.active) {
    throw new AuthenticationError("Your account was deactivated.")
  }

  // update user by google
  if (photos.length > 0) {
    const googlePhotoUrl = photos[0].value
    const photo = await downloadImage(googlePhotoUrl, user._id.toString())
    if (photo) {
      user.photo = photo
      user.googlePhoto = googlePhotoUrl
    }
  }
  user.googleId = googleId
  user.email = email
  user.name = fullName
  user = await userRepository.update(user)
  return user
}
