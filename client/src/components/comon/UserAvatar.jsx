import React from "react"
import { Avatar } from "antd"
import PropTypes from "prop-types"
import UserShape from "types/user"

function UserAvatar({ user, className }) {
  return (
    <Avatar src={user.photo} className={className}>
      {user.name ? user.name[0] : `${user.email[0]}@`}
    </Avatar>
  )
}

UserAvatar.propTypes = {
  user: UserShape.isRequired,
  className: PropTypes.string,
}

UserAvatar.defaultProps = {
  className: null,
}

export default UserAvatar
