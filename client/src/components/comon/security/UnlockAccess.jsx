import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import isAuthorized from "@shared/security/isAuthorized"
import { fetchBoardMembers, fetchLoggedUser } from "actions"
import UserShape from "types/user"
import MemberShape from "types/member"
import { changeEditMode } from "../../../actions/boardToolsAction"

const UnlockAccess = ({ children, globalRoles, boardRoles, lock, user, member, checkSelf, editMode }) => {
  const permission = isAuthorized(globalRoles, boardRoles, user, member) || (checkSelf === user._id)

  if (! permission && editMode) {
    changeEditMode(false)
  }

  return (
    <>
      {permission ? children : lock}
    </>
  )
}

function mapStateToProps({ auth, boards, boardTools }) {
  const props = {
    user: auth || null,
    member: null,
    editMode: boardTools.editMode
  }

  if (boards && boards.members && auth) {
    props.member = boards.members.find((m) => m.user._id === auth._id)
  }
  return props
}

UnlockAccess.propTypes = {
  children: PropTypes.node,
  globalRoles: PropTypes.arrayOf(PropTypes.string),
  boardRoles: PropTypes.arrayOf(PropTypes.string),
  lock: PropTypes.node,
  user: UserShape,
  member: MemberShape,
  checkSelf: PropTypes.string,
  editMode: PropTypes.bool.isRequired
}

UnlockAccess.defaultProps = {
  globalRoles: [],
  boardRoles: [],
  lock: null,
  user: null,
  member: null,
  checkSelf: null,
  children: undefined
}

export default connect(mapStateToProps, { fetchUser: fetchLoggedUser, fetchBoardMembers, changeEditMode })(
  UnlockAccess
)
