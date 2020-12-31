import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchBoard, SUBJECT_BOARD } from "actions"
import PropTypes from "prop-types"

import { Spin } from "antd"
import "./board.sass"
import BoardShape from "types/board"
import LoadingShape from "types/loading"
import history from "helpers/history"
import BoardItems from "./BoardItems"
import { initialBoardToolsState } from "../../actions/boardToolsAction"

class Board extends Component {
  componentDidMount() {
    const {
      identifier,
      fetchBoard: fetchAction,
      initialBoardToolsState: setInitialState
    } = this.props

    fetchAction(identifier)
    setInitialState()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      identifier,
      fetchBoard: fetchAction,
      initialBoardToolsState: setInitialState
    } = this.props

    if (prevProps.identifier !== identifier) {
      fetchAction(identifier)
      setInitialState()
    }
  }

  render() {
    const { board, loading, location } = this.props
    const spinning = !!loading?.states[SUBJECT_BOARD]

    return (
      <Spin spinning={spinning}>
        <div className="board-layout-content">
          {board ? (
            <div className="board">
              <BoardItems board={board} history={history} location={location} />
            </div>
          ) : (
            <div className="fill" />
          )}
        </div>
      </Spin>
    )
  }
}

Board.propTypes = {
  board: BoardShape,
  loading: LoadingShape,
  fetchBoard: PropTypes.func.isRequired,
  initialBoardToolsState: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.string).isRequired
}

Board.defaultProps = {
  board: null,
  loading: null
}

function mapStateToProps({ boards, loading }) {
  if (boards) {
    return { loading, board: boards?.board }
  }
  return { loading }
}

export default connect(mapStateToProps, { fetchBoard, initialBoardToolsState })(Board)
