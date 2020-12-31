const mongoose = require("mongoose")

const MemberModel = require("../../model/models/Member")
const isAuthorized = require("../../../../shared/security/isAuthorized")

const AuthorizationError = require("../../exceptions/AuthorizationError")

const Member = mongoose.model(MemberModel.SCHEMA)

/**
 * Checks if user has role or member role to do a specific request.
 * If boardRoles are given, it also checks for board roles and append membership if exists
 * @param {array<string>} roles
 * @param {array<string>} boardRoles
 * @return {function(e.Request, e.Response, function): any}
 */
module.exports = (roles = [], boardRoles = []) => {
  return async (req, res, next) => {
    let membership = null

    if (boardRoles.length && res.locals.board) {
      if (!res.locals.boardMember) {
        res.locals.boardMember = await Member.findOne({
          [MemberModel.ATTR_USER]: req.user._id,
          [MemberModel.ATTR_BOARD]: res.locals.board._id
        })
      }
      membership = res.locals.boardMember
    }
    const authorized = isAuthorized(roles, boardRoles, req.user, membership)

    // User's role is not authorized
    return authorized ? next() : next(new AuthorizationError("Unauthorized", 403))
  }
}
