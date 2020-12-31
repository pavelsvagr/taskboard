const { downloadImage } = require("../downloader")
const keys = require("../../../config/keys")
const userRepository = require("../../model/repositories/UserRepository")
const AuthenticationError = require("../../exceptions/AuthorizationError")
const Role = require("../../../../shared/security/roles")
const User = require("../../model/entities/User")

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
    if (!user && keys.whitelistedEmails) {
      for (const emailEnding of keys.whitelistedEmails.split(',')) {
        if (email.endsWith(`@${emailEnding}`)) {
          // User is whitelisted, give it base permission and create him
          user = new User(googleId, email, null, null, fullName, Role.Mod, true)
          user = await userRepository.create(user)
          break
        }
      }
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
