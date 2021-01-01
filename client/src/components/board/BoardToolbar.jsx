import React, {Component} from "react"
import {Route} from "react-router-dom"
import {Button, Col, Dropdown, Row, Tooltip} from "antd"
import DateSwitcher from "components/comon/inputs/DateSwitcher"
import {ContainerOutlined, CopyOutlined, PicCenterOutlined, SettingOutlined, SyncOutlined,} from "@ant-design/icons"
import {getIntervalTypeColor} from "helpers/intervalTypes"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import MomentPropTypes from "react-moment-proptypes"

import {getDateFromTo} from "@shared/utils/interval"
import BoardShape from "types/board"
import SettingsShape from "types/settings"
import {fetchBoard, fetchBoardSettings, updateBoardSettings} from "actions"
import PrioritiesSelect from "components/boards/forms/PrioritiesSelect"
import {getAssignmentTypeColor} from "helpers/assignmentTypes"
import UnlockForBoardAdmin from "components/comon/security/UnlockForBoardAdmin"
import history from "../../helpers/history"
import BoardSettingsModal from "./modals/BoardSettingsModal"
import {
  changeBoardDate,
  changeEditMode,
  copyBoardTasks,
  pasteBoardTasks,
  reloadTaskBoard,
} from "../../actions/boardToolsAction"

class BoardToolbar extends Component {
  changePriorities = (priorities, send) => {
    const {
      settings,
      board,
      updateBoardSettings: updateAction,
      boardTools,
    } = this.props

    let newSettings
    if (settings) {
      if (!send && settings.priorities === priorities) {
        return
      }
      newSettings = {...settings, priorities}
    } else {
      newSettings = {priorities, deactivated: []}
    }
    updateAction(board.identifier, boardTools.date, newSettings, send)
  }

  handlePrioritiesChange = (priorities) => {
    this.changePriorities(priorities, false)
  }

  handleAfterPrioritiesChange = (priorities) => {
    this.changePriorities(priorities, true)
  }

  handleChangeMode = () => {
    const {changeEditMode: changeModeAction, boardTools} = this.props
    changeModeAction(!boardTools.editMode)
  }

  handleCopyBoard = () => {
    const {
      copyBoardTasks: copyTasks,
      boardTools,
      board,
      settings,
    } = this.props
    copyTasks(board, boardTools.date, settings)
  }

  handlePasteBoard = () => {
    const {pasteBoardTasks: pasteTasks, board, boardTools} = this.props
    pasteTasks(board, boardTools.date, boardTools.boardCopy)
  }

  handleReload = () => {
    const {reloadTaskBoard: reload, boardTools, board} = this.props
    reload(board, boardTools.date)
  }

  handleDateChange = (date) => {
    const {changeBoardDate: changeDate, board} = this.props
    changeDate(board, date)
  }

  render() {
    const {disabled, board, settings, boardTools} = this.props

    const {editMode, boardCopy, date} = boardTools

    const hasCopy =
      boardCopy &&
      boardCopy?.fromDate.format("YYYY-MM-DD") !==
      getDateFromTo(date, board.intervals)[0].format("YYYY-MM-DD")

    const tagColor = board
      ? getAssignmentTypeColor(board.assignment)
      : "transparent"

    const tagIntervalColor = board
      ? getIntervalTypeColor(board.intervals)
      : "transparent"

    const buttonProps = {shape: "circle", disabled, ghost: true}

    return (
      <div className="board__toolbar">
        <Row
          className="board__toolbar__head"
          style={{
            margin: 0,
            background: `linear-gradient(to right, ${tagColor}, ${tagIntervalColor})`,
          }}
        >
          <Col xs={24} sm={24} md={24} lg={6} xl={7} xxl={7} order={1}>
            <h1 style={{color: "white"}}>{board.name}</h1>
          </Col>
          <Col
            xs={{span: 24, order: 3}}
            sm={{span: 24, order: 3}}
            md={{span: 24, order: 3}}
            lg={{span: 12, order: 2}}
            xl={{span: 10, order: 2}}
            xxl={{span: 10, order: 2}}
            className="text-center"
          >
            <DateSwitcher
              className="board-picker"
              buttonProps={{
                className: "button--light",
                ghost: true,
                shape: "circle",
              }}
              disabled={!!disabled}
              selected={date}
              onChange={this.handleDateChange}
              intervals={board.intervals}
            />
            <UnlockForBoardAdmin>
              <Row>
                <Col span={24}>
                  <Dropdown
                    placement="bottomCenter"
                    overlay={(
                      <div className='shadow window p-md'>
                        <PrioritiesSelect
                          disabled={disabled}
                          width={300}
                          onChange={this.handlePrioritiesChange}
                          onAfterChange={this.handleAfterPrioritiesChange}
                          value={settings?.priorities || board?.priorities}
                        />
                      </div>
                    )}
                    trigger={['click']}
                  >
                    <Button
                      size='small'
                      className="ant-dropdown-link button--light-text m-xs"
                      onClick={e => e.preventDefault()}
                    >
                      Change priorities
                    </Button>
                  </Dropdown>
                </Col>
              </Row>
            </UnlockForBoardAdmin>
          </Col>
          <Col
            xs={{span: 24, order: 2}}
            sm={{span: 24, order: 2}}
            md={{span: 24, order: 2}}
            lg={{span: 6, order: 3}}
            xl={{span: 7, order: 3}}
            xxl={{span: 7, order: 3}}
            className="board__toolbar__actions"
          >
            <div className="table__actions">
              <Tooltip title="Reload board">
                <Button
                  className="button--light"
                  icon={<SyncOutlined />}
                  onClick={this.handleReload}
                  {...buttonProps}
                />
              </Tooltip>
              <UnlockForBoardAdmin>
                <Tooltip title="Show settings">
                  <Button
                    className="button--light"
                    icon={<SettingOutlined />}
                    onClick={() =>
                      history.push(`/board/${board.identifier}/settings`)}
                    {...buttonProps}
                  />
                </Tooltip>
                <Tooltip title="Copy board content">
                  <Button
                    className="button--light"
                    icon={<CopyOutlined />}
                    onClick={this.handleCopyBoard}
                    {...buttonProps}
                  />
                </Tooltip>
                {hasCopy && (
                  <Tooltip title="Paste copied board content">
                    <Button
                      className="button--light"
                      icon={<ContainerOutlined />}
                      onClick={this.handlePasteBoard}
                      {...buttonProps}
                    />
                  </Tooltip>
                )}
                <Tooltip
                  title={editMode ? "Turn off reordering" : "Reorder users"}
                >
                  <Button
                    className={
                      editMode
                        ? "button--light button--active"
                        : "button--light "
                    }
                    icon={<PicCenterOutlined />}
                    onClick={this.handleChangeMode}
                    {...buttonProps}
                  />
                </Tooltip>
              </UnlockForBoardAdmin>
            </div>
          </Col>
        </Row>
        {board && (
          <Route
            exact
            path="/board/:identifier/settings"
            render={({match}) => (
              <BoardSettingsModal
                onClose={() =>
                  history.push(`/board/${match.params.identifier}`)}
                onReload={this.handleReload}
              />
            )}
          />
        )}
      </div>
    )
  }
}

BoardToolbar.propTypes = {
  board: BoardShape,
  settings: SettingsShape,
  updateBoardSettings: PropTypes.func.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  fetchBoardSettings: PropTypes.func.isRequired,
  copyBoardTasks: PropTypes.func.isRequired,
  pasteBoardTasks: PropTypes.func.isRequired,
  reloadTaskBoard: PropTypes.func.isRequired,
  changeBoardDate: PropTypes.func.isRequired,
  boardTools: PropTypes.shape({
    date: MomentPropTypes.momentObj.isRequired,
    editMode: PropTypes.bool.isRequired,
    boardCopy: PropTypes.shape({
      fromDate: PropTypes.oneOfType([
        MomentPropTypes.momentObj,
        PropTypes.object,
      ]),
      toDate: PropTypes.oneOfType([
        MomentPropTypes.momentObj,
        PropTypes.object,
      ]),
      settings: SettingsShape,
    }),
  }).isRequired,
  disabled: PropTypes.bool,
}

BoardToolbar.defaultProps = {
  board: null,
  settings: null,
  disabled: false,
}

function mapStateToProps({boardSettings, boards, boardTools}) {
  return {
    settings: boardSettings,
    boards: boards?.board,
    boardTools,
  }
}

export default connect(mapStateToProps, {
  fetchBoard,
  changeEditMode,
  updateBoardSettings,
  fetchBoardSettings,
  copyBoardTasks,
  pasteBoardTasks,
  reloadTaskBoard,
  changeBoardDate,
})(BoardToolbar)
