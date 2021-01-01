import React, {Component} from "react"
import {connect} from "react-redux"
import queryString from "query-string"
import moment from "moment"
import {Spin} from "antd"
import shapes from "types"
import PropTypes from "prop-types"

import {SUBJECT_BOARD, updateBoardMembers, updateBoardTeamMembers,} from "actions"
import arrayMove from "@shared/utils/arrayMove"
import {getDateFromTo} from "@shared/utils/interval"
import * as MomentPropTypes from "react-moment-proptypes"
import BoardItemEditModal from "./modals/BoardItemEditModal"
import BoardToolbar from "./BoardToolbar"
import BoardItemsGrid from "./grid/BoardItemsGrid"
import {reorderBoardTeams} from "../../actions"
import {changeBoardDate, reloadTaskBoard,} from "../../actions/boardToolsAction"

class BoardItems extends Component {
  componentDidMount() {
    const {
      board,
      date,
      reloadTaskBoard: reload,
      changeBoardDate: changeDate,
    } = this.props

    const { location } = this.props
    const { search } = location

    let finalDate = date

    if (search) {
      const params = queryString.parse(search)
      finalDate = moment(params.date)
    }
    [finalDate] = getDateFromTo(finalDate, board.intervals)

    if (date.format("YYYY-MM-DD") !== finalDate.format("YYYY-MM-DD")) {
      changeDate(board, finalDate, false)
    }
    reload(board, finalDate)
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { board: prevBoard } = prevProps
    const { board, date, reloadTaskBoard: reload } = this.props

    if (prevBoard.identifier !== board.identifier) {
      reload(board, date)
    }
  }

  handleReorderTeams = (source, target) => {
    if (source === target) {
      return
    }

    const { board, reorderBoardTeams: reorderTeams, teams } = this.props
    const actualTeams = [...teams]
    const newTeams = arrayMove(actualTeams, source, target)

    let i = 1
    for (const team of newTeams) {
      team.order = i
      i += 1
    }

    reorderTeams(board.identifier, newTeams)
  }

  handleReorderMembers = (teamId, sourceId, targetId) => {
    const { members, teams, board, updateBoardMembers: updateMembers, updateBoardTeamMembers: updateTeamMembers } = this.props

    if (teamId === "others") {
      const source = members.findIndex((m) => m._id === sourceId)
      const target = members.findIndex((m) => m._id === targetId)

      let newMembers = arrayMove(members, source, target)

      newMembers = newMembers.map((m, i) => {
        return { ...m, order: i + 1 }
      })
      updateMembers(board.identifier, newMembers)
      return
    }

    const team = teams.find((t) => t._id === teamId)

    const teamMembers = [...team.members]
    const sourceIndex = teamMembers.findIndex((m) => m === sourceId)
    const targetIndex = teamMembers.findIndex((m) => m === targetId)

    const [removed] = teamMembers.splice(sourceIndex, 1)
    teamMembers.splice(targetIndex, 0, removed)
    updateTeamMembers(
      board.identifier,
      team.identifier,
      teamMembers
    )
  }

  render() {
    const {
      board,
      loading,
      members,
      teams,
      boardItems,
      boardSettings,
      assignment,
    } = this.props

    const priorities = boardSettings?.priorities || board?.priorities || 3

    const items = boardItems || []
    const teamsData = teams || []
    const membersData = members || []

    const allMembers = {}
    for (const member of membersData) {
      allMembers[member._id] = member
    }

    const teamMembers = {}
    const otherMembers = []
    if (teamsData && membersData) {
      for (const team of teamsData) {
        for (const member of team.members) {
          teamMembers[member] = true
        }
      }
      for (const member of membersData) {
        if (!teamMembers[member._id]) {
          otherMembers.push(member)
        } else {
          teamMembers[member._id] = member
        }
      }
    }

    const loadingState =
      loading?.states[SUBJECT_BOARD] || !(members && teams && boardItems)
    const spinning = !!(loading?.active && loadingState)

    return (
      <div>
        {assignment && !board.hasInlineEdit && (
          <BoardItemEditModal maxPriority={priorities} />
        )}
        <BoardToolbar
          board={board}
          boardTeams={teams}
          disabled={!!loadingState}
          members={members}
        />
        <Spin spinning={spinning}>
          {!loadingState ? (
            <BoardItemsGrid
              board={board}
              loading={loading}
              data={items}
              teams={teamsData}
              teamMembers={teamMembers}
              otherMembers={otherMembers}
              onReorder={this.handleReorderMembers}
              onReorderTeams={this.handleReorderTeams}
              priorities={priorities}
            />
          ) : (
            <div className="board__content" />
          )}
        </Spin>
      </div>
    )
  }
}

BoardItems.propTypes = {
  board: shapes.board.isRequired,
  reloadTaskBoard: PropTypes.func.isRequired,
  changeBoardDate: PropTypes.func.isRequired,
  reorderBoardTeams: PropTypes.func.isRequired,
  updateBoardTeamMembers: PropTypes.func.isRequired,
  updateBoardMembers: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(shapes.member),
  teams: PropTypes.arrayOf(shapes.team),
  assignment: shapes.assignment,
  boardItems: PropTypes.arrayOf(shapes.boardItem),
  date: MomentPropTypes.momentObj.isRequired,
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  loading: shapes.loading,
  boardSettings: shapes.settings,
}

BoardItems.defaultProps = {
  loading: null,
  boardSettings: null,
  boardItems: [],
  assignment: null,
  members: [],
  teams: [],
}

function mapStateToProps({
  loading,
  boardItems,
  boardAssignments,
  boards,
  boardSettings,
  boardTools,
}) {
  if (boards) {
    return {
      board: boards.board,
      date: boardTools.date,
      assignment: boardTools.assignment,
      boardSettings,
      members: boards.members,
      teams: boards.teams,
      boardItems,
      boardAssignments,
      loading,
    }
  }
  return {
    loading,
    boardItems,
    boardAssignments,
    boardSettings,
    date: boardTools.date,
  }
}

export default connect(mapStateToProps, {
  reloadTaskBoard,
  changeBoardDate,
  reorderBoardTeams,
  updateBoardTeamMembers,
  updateBoardMembers,
})(BoardItems)
