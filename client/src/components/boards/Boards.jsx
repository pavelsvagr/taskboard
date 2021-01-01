import React, { Component } from "react"
import { Route } from "react-router-dom"
import { connect } from "react-redux"
import {
  fetchBoards,
  fetchLoggedUser,
  sendBoard,
  SUBJECT_BOARDS,
} from "actions"

import { Modal, Spin } from "antd"

import history from "helpers/history"
import PropTypes from "prop-types"
import BoardsBox from "./BoardsBox"
import BoardForm from "./forms/BoardForm"
import shapes from "../../types"

class Boards extends Component {
  componentDidMount() {
    const { fetchBoards: fetch } = this.props
    fetch()
  }

  handleShowForm = (board) => {
    if (board) {
      history.push(`/boards/${board._id}`)
    } else {
      history.push("/boards/new")
    }
  }

  render() {
    const { loading } = this.props
    const spinning = !!loading?.states[SUBJECT_BOARDS]

    return (
      <Spin spinning={spinning}>
        <h1>Boards</h1>

        <BoardsBox
          onNew={() => this.handleShowForm(null)}
          sizing={{ xs: 24, sm: 24, md: 12, xl: 8, xxl: 6 }}
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
          onCardClick={(board) => history.push(`/board/${board.identifier}`)}
        />

        <Route
          exact
          path="/boards/:identifier"
          render={({ match }) => {
            const id = match.params.identifier
            const board = null
            return id === "new" ? (
              <Modal
                title="New board"
                visible
                footer={null}
                closable
                onCancel={() => history.push("/boards")}
              >
                <BoardForm board={board} />
              </Modal>
            ) : (
              ""
            )
          }}
        />
      </Spin>
    )
  }
}

Boards.propTypes = {
  fetchBoards: PropTypes.func.isRequired,
  loading: shapes.loading,
}

Boards.defaultProps = {
  loading: null,
}

function mapStateToProps({ auth, loading }) {
  return { auth, loading }
}

export default connect(mapStateToProps, {
  fetchUser: fetchLoggedUser,
  fetchBoards,
  sendBoard,
})(Boards)
