function isAuthorized(globalRoles = [], boardRoles = [], user = null, membership = null) {
    let authorized = user && globalRoles.length && globalRoles.includes(user.role) // User's role is authorized by roles

    if (!authorized && membership && boardRoles.length) {
        // Not authorized by global, so try membership
        authorized = boardRoles.includes(membership.role) // User has required role
    }

    return authorized
}

module.exports = isAuthorized