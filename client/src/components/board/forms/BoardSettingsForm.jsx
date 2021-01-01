import React, { Component } from "react"
import { connect } from "react-redux"

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Spin,
  Switch,
  Tag,
  Typography,
} from "antd"
import { deleteBoard, SUBJECT_BOARD, updateBoard } from "actions"
import { getAssignmentTypeColor } from "helpers/assignmentTypes"
import { getIntervalTypeColor } from "helpers/intervalTypes"
import CredentialCard from "components/credentials/CredentialCard"
import ConfirmNameModal from "components/comon/modals/ConfirmNameModal"
import PrioritiesSelect from "components/boards/forms/PrioritiesSelect"
import PropTypes from "prop-types"
import FormSubmit from "../../comon/inputs/FormSubmit"
import { renderAntItem } from "../../../helpers/forms"
import shapes from "../../../types"

class BoardSettingsForm extends Component {
  formRef = React.createRef()

  // Rules for form validation
  rules = {
    name: [
      { type: "string", message: "Name must be a valid string." },
      { required: true, message: "Name is required." },
      { min: 5, message: "Name must be at least 5 chars long." },
      { max: 100, message: "Name must be max 100 chars long." },
    ],
    identifier: [
      { type: "string", message: "Identifier must be a valid string." },
      { required: true, message: "Identifier is required." },
      { min: 5, message: "Identifier must be at least 5 chars long." },
      { max: 100, message: "Identifier must be max 100 chars long." },
      {
        pattern: /^[a-zA-Z]/,
        message: "Identifier must start with letter",
      },
      {
        pattern: /[a-zA-Z0-9]$/,
        message: "Identifier must end with letter or number",
      },
      {
        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        message: "Identifier can contains only letters, numbers and -",
      },
    ],
  }

  // Items for form inputs
  items = {
    name: {
      label: "Board name",
      name: "name",
      rules: this.rules.name,
      hasFeedback: true,
    },
    identifier: {
      label: "Identifier",
      name: "identifier",
      dependencies: ["name"],
      rules: this.rules.identifier,
      hasFeedback: true,
    },
    hasAvatars: {
      label: "Avatars",
      name: "hasAvatars",
      valuePropName: "checked",
    },
    hasInlineEdit: {
      label: "Inline editing",
      name: "hasInlineEdit",
      valuePropName: "checked",
    },
    hasEmailNotifications: {
      label: "Email notifications",
      name: "hasEmailNotifications",
      valuePropName: "checked",
    },
    priorities: {
      label: "Default priorities",
      name: "priorities",
    },
  }

  constructor(props) {
    super(props)

    this.state = {
      deleteModal: false,
    }
  }

  handleToggleDeleteModal = () => {
    const { deleteModal } = this.state
    this.setState({ deleteModal: !deleteModal })
  }

  handleChangeName = (e) => {
    const identifier = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +|_+/g, "-")
      .replace(/-+/, "-")
    this.formRef.current.setFieldsValue({ identifier })
  }

  handleDeleteBoard = () => {
    const { deleteBoard: deleteAction, board } = this.props
    deleteAction(board.identifier)
  }

  handleSubmit = (values) => {
    const { updateBoard: updateAction, board } = this.props
    updateAction(board.identifier, values)
  }

  render() {
    const { error, board, loading } = this.props
    const { deleteModal } = this.state
    const defaults = board

    const spinning =
      loading.active !== 0 && loading.states[SUBJECT_BOARD] !== undefined

    return (
      <Spin spinning={spinning}>
        <ConfirmNameModal
          visible={deleteModal}
          title={`Delete ${board.name}`}
          onCancel={this.handleToggleDeleteModal}
          onOk={this.handleDeleteBoard}
          text={(
            <div>
              If you really want to delete this board and all its contents,
              type:
              <div>
                <strong>{board.identifier}</strong>
              </div>
            </div>
          )}
          confirmName={board.identifier}
        />
        <Form
          ref={this.formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          requiredMark={false}
          onFinish={this.handleSubmit}
          initialValues={defaults}
        >
          <Row gutter={[24, 24]}>
            <Col lg={10} xs={24} sm={24} md={10}>
              <div className="form-section">
                <h2>General settings</h2>
              </div>
            </Col>
            <Col lg={14} xs={24} sm={24} md={14}>
              {renderAntItem(
                "name",
                this.items.name,
                error,
                <Input onChange={this.handleChangeName} />
              )}
              {renderAntItem(
                "identifier",
                this.items.identifier,
                error,
                <Input />
              )}
              <Row gutter={[24, 24]}>
                <Col lg={12} className="label">
                  Intervals:
                </Col>
                <Col lg={12}>
                  <Tag color={getIntervalTypeColor(board.intervals)}>
                    {board.intervals}
                  </Tag>
                </Col>
              </Row>
              <Row gutter={[24, 24]}>
                <Col lg={12} className="label">
                  Task type:
                </Col>
                <Col lg={12}>
                  <Tag color={getAssignmentTypeColor(board.assignment)}>
                    {board.assignment}
                  </Tag>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="label">
                  Credentials:
                </Col>
                <Col span={24}>
                  <CredentialCard
                    className="fill"
                    credentials={board.credentials}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 24]}>
            <Col lg={10} xs={24} sm={24} md={10}>
              <div className="form-section">
                <h2>Board appearance</h2>
                <div className="title-desc">
                  Board UI settings that can make user experience better.
                </div>
              </div>
            </Col>
            <Col lg={14} xs={24} sm={24} md={14}>
              {renderAntItem(
                "priorities",
                this.items.priorities,
                error,
                <PrioritiesSelect width={250} />
              )}
              {renderAntItem(
                "hasAvatars",
                this.items.hasAvatars,
                error,
                <Switch />
              )}
              {renderAntItem(
                "hasInlineEdit",
                this.items.hasInlineEdit,
                error,
                <Switch />
              )}
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 24]}>
            <Col lg={10} xs={24} sm={24} md={10}>
              <div className="form-section">
                <h2>Notifications</h2>
                <div className="title-desc">
                  Information sent when you add member, change role or assign a
                  task.
                </div>
              </div>
            </Col>
            <Col lg={14} xs={24} sm={24} md={14}>
              {renderAntItem(
                "hasEmailNotifications",
                this.items.hasEmailNotifications,
                error,
                <Switch />
              )}
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 24]}>
            <Col lg={10} xs={24} sm={24} md={10}>
              <div className="form-section">
                <h2>Delete board</h2>
                <div className="title-desc">
                  Deleting boards is irreversible.
                </div>
              </div>
            </Col>
            <Col lg={14} xs={24} sm={24} md={14}>
              <div
                className="text-center fill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  danger
                  onClick={this.handleToggleDeleteModal}
                >
                  Delete board
                </Button>
              </div>
            </Col>
          </Row>
          <Divider />
          {error && !error.fields && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
          <FormSubmit title="Save" size="large" />
        </Form>
      </Spin>
    )
  }
}

BoardSettingsForm.propTypes = {
  loading: shapes.loading,
  board: shapes.board,
  error: shapes.errors,
  deleteBoard: PropTypes.func.isRequired,
  updateBoard: PropTypes.func.isRequired,
}

BoardSettingsForm.defaultProps = {
  loading: null,
  board: null,
  error: null,
}

function mapStateToProps({ loading, errors }) {
  return { loading, errors: errors?.errors }
}

export default connect(mapStateToProps, {
  updateBoard,
  deleteBoard,
})(BoardSettingsForm)
