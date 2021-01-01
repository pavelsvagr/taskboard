import React from "react"
import { Modal, Tabs } from "antd"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import {
  fetchBoardMembers,
  fetchBoardTeams,
  reorderBoardTeams,
  updateBoard,
  updateBoardItem,
  updateBoardMember,
  updateBoardMembers,
  updateBoardTeamMembers,
} from "actions"
import BoardShape from "types/board"
import MemberShape from "types/member"
import TeamShape from "types/team"
import BoardSettingsForm from "../forms/BoardSettingsForm"
import BoardMembersGrid from "../members/BoardMembersGrid"
import BoardTeamsForm from "../forms/BoardTeamsForm"
import BoardFiltersForm from "../forms/BoardFiltersForm"

function BoardSettingsModal({ board, members, boardTeams, onReload, onClose }) {
  const { TabPane } = Tabs

  return (
    <Modal
      visible
      className="basic-modal"
      title={`${board.name} settings`}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Settings" key="1" className="basic-modal__body">
          <BoardSettingsForm board={board} />
        </TabPane>
        <TabPane tab="Members" key="2" className="basic-modal__body">
          <BoardMembersGrid board={board} members={members} />
        </TabPane>
        <TabPane tab="Teams" key="3" className="basic-modal__body">
          <BoardTeamsForm
            board={board}
            boardTeams={boardTeams ? boardTeams.map((t) => t._id) : []}
          />
        </TabPane>
        <TabPane tab="Tasks filter" key="4" className="basic-modal__body">
          <BoardFiltersForm board={board} afterSubmit={onReload} />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

BoardSettingsModal.propTypes = {
  board: BoardShape,
  members: PropTypes.arrayOf(MemberShape),
  boardTeams: PropTypes.arrayOf(TeamShape),
  onReload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

BoardSettingsModal.defaultProps = {
  board: null,
  members: null,
  boardTeams: null,
}

function mapStateToProps({ boards }) {
  return {
    board: boards?.board,
    members: boards?.members,
    boardTeams: boards?.teams,
  }
}

export default connect(mapStateToProps, {
  fetchBoardMembers,
  fetchBoardTeams,
  updateBoard,
  reorderBoardTeams,
  updateBoardItem,
  updateBoardTeamMembers,
  updateBoardMember,
  updateBoardMembers,
})(BoardSettingsModal)
