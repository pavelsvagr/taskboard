import React, { Component } from "react"
import { connect } from "react-redux"
import { createBoardMembers, fetchUsers, SUBJECT_USERS, updateTeamMembers } from "actions"

import { Button, Col, Form, Row, Spin } from "antd"
import UserSelect from "components/comon/inputs/UserSelect"
import PropTypes from "prop-types"
import errorsShape from "../../../types/errors"
import loadingShape from "../../../types/loading"
import teamShape from "../../../types/team"
import boardShape from "../../../types/board"
import userShape from "../../../types/user"
import { renderAntItem } from "../../../helpers/forms"

export const TYPE_BOARD_MEMBERS = "board"
export const TYPE_TEAM_MEMBERS = "team"

class UserMemberForm extends Component {
  formRef = React.createRef()

  initialValues = {
    members: []
  }

  // Items for form inputs
  items = {
    members: {
      name: "members",
      rules: []
    }
  }

  componentDidMount() {
    const { fetchUsers: fetch } = this.props
    fetch()
  }

  handleSubmit = (values) => {
    const {
      type,
      taken,
      team,
      board,
      updateTeamMembers: postTeamMembers,
      createBoardMembers: postBoardMembers,
      onSubmit
    } = this.props

    const previous = taken || []

    if (type === TYPE_TEAM_MEMBERS) {
      const newMembers = [...previous.map((item) => item._id), ...values.members]
      postTeamMembers(team.identifier, newMembers)
    } else {
      postBoardMembers(board.identifier, values.members)
    }
    if (onSubmit) {
      onSubmit()
    } else {
      this.formRef.current.setFieldsValue(this.initialValues)
    }
  }

  render() {
    const { taken, loading, error } = this.props
    const defaults = this.initialValues

    const disabledMembers = taken || []

    const disabled = {}
    for (const user of disabledMembers) {
      disabled[user._id] = true
    }

    const spinning = loading[SUBJECT_USERS] !== undefined

    return (
      <Spin spinning={spinning}>
        <Form
          ref={this.formRef}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="horizontal"
          requiredMark={false}
          onFinish={this.handleSubmit}
          initialValues={defaults}
        >
          <Row gutter={[6, 0]}>
            <Col span={18}>
              {renderAntItem("members", this.items.members, error,
                <UserSelect disabled={disabled} />
              )}
            </Col>
            <Col span={6}>
              <Button htmlType="submit" type="primary" className="full-width">Add</Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    )
  }
}

function mapStateToProps({ loading, errors }) {
  return { loading, error: errors?.errors }
}

UserMemberForm.propTypes = {
  error: errorsShape,
  loading: loadingShape,
  taken: PropTypes.arrayOf(userShape),
  board: boardShape,
  team: teamShape,
  onSubmit: PropTypes.func,

  type: PropTypes.oneOf([TYPE_BOARD_MEMBERS, TYPE_TEAM_MEMBERS]).isRequired,
  fetchUsers: PropTypes.func.isRequired,
  createBoardMembers: PropTypes.func.isRequired,
  updateTeamMembers: PropTypes.func.isRequired
}

UserMemberForm.defaultProps = {
  error: null,
  onSubmit: null,
  loading: null,
  taken: [],
  team: null,
  board: null
}

export default connect(mapStateToProps, {
  updateTeamMembers,
  createBoardMembers,
  fetchUsers
})(UserMemberForm)
