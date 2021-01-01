import React, { Component } from "react"

import { Col, Collapse, Row, Spin } from "antd"
import getColSpan from "helpers/colSpan"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
  SUBJECT_BOARD_ITEMS,
  SUBJECT_BOARD_MEMBERS,
  SUBJECT_BOARD_SETTINGS,
  SUBJECT_BOARD_TEAMS,
} from "../../../actions"
import BoardItemRow from "./BoardItemRow"
import DroppableSpace from "./specials/DroppableSpace"
import DraggableHeader from "./specials/DraggableHeader"
import { changeEditMode } from "../../../actions/boardToolsAction"
import shapes from "../../../types"

class BoardItemsGrid extends Component {
  onDragEnd = (result) => {
    const { otherMembers, onReorder, teams } = this.props
    const { destination, source } = result

    // dropped outside the list or same index
    if (!destination || source.index === destination.index) {
      return
    }
    let sourceIndex
    let targetIndex

    if (source.droppableId === "others") {
      sourceIndex = otherMembers[source.index]._id
      targetIndex = otherMembers[destination.index]._id
    } else {
      const { members } = teams.find((t) => t._id === source.droppableId)
      sourceIndex = members[source.index]
      targetIndex = members[destination.index]
    }

    onReorder(source.droppableId, sourceIndex, targetIndex)
  }

  onDragTeamsEnd = (result) => {
    const { destination, source } = result
    const { teams, onReorderTeams } = this.props

    if (
      !destination ||
      source.index === destination.index ||
      destination.index >= teams.length
    ) {
      return
    }

    onReorderTeams(source.index, destination.index)
  }

  renderOthers = (otherMembers, items, cols) => {
    const { editMode, board } = this.props

    const Wrapper = editMode ? DroppableSpace : "div"
    const wrapperProps = editMode
      ? {
          onDragEnd: this.onDragEnd,
          droppableId: "others",
          className: "color-white",
        }
      : { className: "color-white" }

    return (
      <Wrapper {...wrapperProps}>
        {otherMembers.length !== 0 && (
          <>
            {otherMembers.map((member, memberIndex) => (
              <BoardItemRow
                key={member._id}
                board={board}
                member={member}
                items={items}
                cols={cols}
                index={memberIndex}
              />
            ))}
          </>
        )}
      </Wrapper>
    )
  }

  render() {
    const {
      board,
      teams,
      teamMembers,
      otherMembers,
      priorities,
      data,
      loading,
      editMode,
    } = this.props
    const items = {}
    for (const item of data) {
      items[item.member] = item
    }

    const cols = Array(priorities)
      .fill(0)
      .map((x, i) => i)

    const openTeams = [...teams.map((team) => team._id)]
    if (otherMembers.length) {
      openTeams.push("others")
    }

    const spinning =
      loading &&
      !!(
        loading.states[SUBJECT_BOARD_ITEMS] ||
        loading.states[SUBJECT_BOARD_TEAMS] ||
        loading.states[SUBJECT_BOARD_MEMBERS] ||
        loading.states[SUBJECT_BOARD_SETTINGS]
      )

    const ItemsWrapper = editMode ? DroppableSpace : React.Fragment

    const TeamsWrapper = editMode ? DroppableSpace : Collapse
    const teamsWrapperProps = editMode
      ? {
          droppableId: "teams",
          onDragEnd: this.onDragTeamsEnd,
        }
      : {
          ghost: true,
          defaultActiveKey: openTeams,
        }
    const TeamWrapper = editMode ? DraggableHeader : Collapse.Panel

    return (
      <Spin spinning={spinning}>
        <div className="board__rows">
          <Row className="board__row--header">
            <Col
              className="board__col--header"
              {...getColSpan(0, priorities, true)}
            >
              Solver
            </Col>
            {cols.map((col) => (
              <Col
                key={col}
                className="board__col--header"
                {...getColSpan(col + 1, priorities, true)}
              >
                Priority 
                {' '}
                {col + 1}
              </Col>
            ))}
          </Row>
          {teams.length !== 0 && (
            <TeamsWrapper {...teamsWrapperProps}>
              {teams.map((team, teamIndex) => {
                const wrapperProps = editMode
                  ? {
                      onDragEnd: this.onDragEnd,
                      droppableId: team._id,
                    }
                  : {}
                return (
                  <TeamWrapper
                    header={team.name}
                    key={team._id}
                    droppableKey={team._id}
                    index={teamIndex}
                    headerClass="board__team-header"
                    className={`color-${team.color}`}
                  >
                    <ItemsWrapper {...wrapperProps}>
                      {team.members.map((memberId, memberIndex) => (
                        <BoardItemRow
                          key={memberId}
                          board={board}
                          team={team}
                          member={teamMembers[memberId]}
                          items={items}
                          cols={cols}
                          index={memberIndex}
                        />
                      ))}
                    </ItemsWrapper>
                  </TeamWrapper>
                )
              })}
              {otherMembers.length !== 0 && (
                <TeamWrapper
                  header="<no team>"
                  key="others"
                  droppableKey="others"
                  isDragDisabled
                  index={teams.length}
                  headerClass="board__team-header"
                  className="color-white"
                >
                  {this.renderOthers(otherMembers, items, cols)}
                </TeamWrapper>
              )}
            </TeamsWrapper>
          )}
          {teams.length === 0 && this.renderOthers(otherMembers, items, cols)}
        </div>
      </Spin>
    )
  }
}

BoardItemsGrid.propTypes = {
  teams: PropTypes.arrayOf(shapes.team),
  board: shapes.board.isRequired,
  otherMembers: PropTypes.arrayOf(shapes.member),
  teamMembers: PropTypes.objectOf(shapes.member),
  onReorderTeams: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  priorities: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(shapes.boardItem),
  loading: shapes.loading,
}

BoardItemsGrid.defaultProps = {
  editMode: false,
  teams: [],
  loading: null,
  data: [],
  teamMembers: null,
  otherMembers: null,
}

function mapStateToProps({ boardTools }) {
  return { editMode: boardTools.editMode }
}

export default connect(mapStateToProps, { changeEditMode })(BoardItemsGrid)
