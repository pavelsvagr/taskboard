import React from "react"
import {
  CheckCircleOutlined,
  ContainerOutlined,
  CopyOutlined, EditOutlined,
  EllipsisOutlined,
  ScissorOutlined,
  StopOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, Menu } from "antd"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import * as MomentPropTypes from "react-moment-proptypes"
import shapes from "../../../../types"
import {
  activateBoardMember,
  changeBoardDate,
  copyBoardRow,
  cutBoardRow,
  deactivateBoardMember, editMemberNickname,
  pasteBoardRow,
} from "../../../../actions/boardToolsAction"
import { fetchBoardSettings } from "../../../../actions"

function MemberDropdown({
  board,
  member,
  settings,
  item,
  date,
  disabled,
  itemCopy,
  pasteBoardRow: paste,
  copyBoardRow: copy,
  cutBoardRow: cut,
  deactivateBoardMember: deactivate,
  activateBoardMember: activate,
  editMemberNickname: editNickname
}) {
  const handleDeactivate = () => deactivate(board, date, member, settings)
  const handleActivate = () => activate(board, date, member, settings)
  const handleCopy = () => copy(item)
  const handleCut = () => cut(board, item)
  const handlePaste = () => paste(board, date, member, itemCopy, item)
  const handleChangeNickname = () => editNickname(member)

  const actions = []
  if (member?.user?.active) {
    actions.push(
      {
        key: "nickname",
        icon: <EditOutlined />,
        name: "Change board name",
        handler: handleChangeNickname,
      }
    )

    actions.push(
      settings?.deactivated?.includes(member?._id)
        ? {
            key: "activate",
            icon: <CheckCircleOutlined />,
            name: "Activate",
            handler: handleActivate,
          }
        : {
            key: "deactivate",
            icon: <StopOutlined />,
            name: "Deactivate",
            handler: handleDeactivate,
          }
    )
  }

  if (item) {
    actions.push({
      key: "copy",
      icon: <CopyOutlined />,
      name: "Copy tasks",
      handler: handleCopy,
    })
    actions.push({
      key: "cut",
      icon: <ScissorOutlined />,
      name: "Cut tasks",
      handler: handleCut,
    })
  }
  if (itemCopy) {
    actions.push({
      key: "paste",
      icon: <ContainerOutlined />,
      name: "Paste tasks",
      handler: handlePaste,
    })
  }

  return (
    <Dropdown
      overlay={(
        <Menu>
          {actions.map((actionDefinition) => {
            const action =
              typeof actionDefinition === "function"
                ? actionDefinition(member, settings)
                : actionDefinition

            return (
              action && (
                <Menu.Item
                  key={action.key}
                  icon={action.icon}
                  onClick={() => action.handler(member, item)}
                >
                  {action.name}
                </Menu.Item>
              )
            )
          })}
        </Menu>
      )}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button shape="circle" icon={<EllipsisOutlined />} disabled={disabled} />
    </Dropdown>
  )
}

MemberDropdown.propTypes = {
  board: shapes.board.isRequired,
  settings: shapes.settings,
  item: shapes.boardItem,
  date: PropTypes.oneOfType([PropTypes.string, MomentPropTypes.momentObj]),
  itemCopy: shapes.boardItem,
  member: shapes.member.isRequired,
  pasteBoardRow: PropTypes.func.isRequired,
  copyBoardRow: PropTypes.func.isRequired,
  cutBoardRow: PropTypes.func.isRequired,
  deactivateBoardMember: PropTypes.func.isRequired,
  activateBoardMember: PropTypes.func.isRequired,
  editMemberNickname: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

MemberDropdown.defaultProps = {
  settings: null,
  itemCopy: null,
  date: null,
  item: null,
  disabled: false,
}

function mapStateToProps({ boardSettings: settings, boardTools }) {
  return {
    settings,
    date: boardTools.date,
    itemCopy: boardTools.itemCopy,
  }
}

export default connect(mapStateToProps, {
  pasteBoardRow,
  copyBoardRow,
  cutBoardRow,
  deactivateBoardMember,
  activateBoardMember,
  fetchBoardSettings,
  changeBoardDate,
  editMemberNickname
})(MemberDropdown)
