import React from "react"
import PropTypes from "prop-types"

import rolesBoardModerator from "@shared/security/rolesBoardModerator"
import UnlockAccess from "./UnlockAccess"

function UnlockForBoardAdmin({ children, ...props }) {
  return (
    <UnlockAccess
      globalRoles={rolesBoardModerator.global}
      boardRoles={rolesBoardModerator.board}
      {...props}
    >
      {children}
    </UnlockAccess>
  )
}

UnlockForBoardAdmin.propTypes = {
  children: PropTypes.node,
}

UnlockForBoardAdmin.defaultProps = {
  children: null,
}

export default UnlockForBoardAdmin
