import React, { Component } from "react"
import { connect } from "react-redux"

import { Form, Spin } from "antd"
import TeamSelectGrid from "components/teams/forms/TeamSelectGrid"
import { SUBJECT_BOARD, SUBJECT_TEAM, updateBoard } from "actions"
import PropTypes from "prop-types"
import FormSubmit from "../../comon/inputs/FormSubmit"
import shapes from "../../../types"
import { renderAntItem } from "../../../helpers/forms"

class BoardSettingsForm extends Component {
  formRef = React.createRef()

  // Items for form inputs
  items = {
    teams: {
      labelCol: { span: 24 },
      name: "teams"
    }
  }

  handleSubmit = (values) => {
    const { board, updateBoard: update } = this.props
    const newBoard = { ...board, ...values }
    newBoard.teams = newBoard.teams.map(t => t._id)
    update(board.identifier, newBoard)
  }

  render() {
    const { boardTeams, loading, error } = this.props

    const defaults = { teams: boardTeams }

    const spinning =
      loading.active !== 0 &&
      (loading.states[SUBJECT_BOARD] || loading.states[SUBJECT_TEAM]) !==
      undefined

    return (
      <Spin spinning={spinning}>
        <Form
          labelCol={{ span: 8 }}
          requiredMark={false}
          onFinish={this.handleSubmit}
          initialValues={defaults}
        >
          {renderAntItem("teams", this.items.teams, error,
            <TeamSelectGrid />
          )}
          <FormSubmit title='Save' size="large" />
        </Form>
      </Spin>
    )
  }
}

BoardSettingsForm.propTypes = {
  board: shapes.board,
  loading: shapes.loading,
  error: shapes.errors,
  updateBoard: PropTypes.func.isRequired,
  boardTeams: PropTypes.arrayOf(shapes.team)
}

BoardSettingsForm.defaultProps = {
  board: null,
  loading: null,
  boardTeams: [],
  error: null
}

function mapStateToProps({ boards, loading, errors }) {
  return { loading, error: errors?.error, board: boards?.board, boardTeams: boards?.teams }
}

export default connect(mapStateToProps, { updateBoard })(BoardSettingsForm)
