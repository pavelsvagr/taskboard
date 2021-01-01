import React, { Component } from "react"
import { connect } from "react-redux"
import { sendTeam, SUBJECT_TEAM, updateTeam } from "actions"

import { Form, Input, Spin, Typography } from "antd"

import boardColors from "@shared/constants/boardColors"
import ColorPicker from "components/comon/inputs/ColorPicker"
import PropTypes from "prop-types"
import FormSubmit from "../../comon/inputs/FormSubmit"
import { renderAntItem } from "../../../helpers/forms"
import EmptyForm from "../../comon/data/EmptyForm"
import shapes from "../../../types"
import { fetchTeam } from "../../../actions"

class TeamForm extends Component {
  formRef = React.createRef()

  initialValues = {
    name: "",
    identifier: "",
    color: "white",
  }

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
        pattern: /^([a-zA-Z0-9-])*$/,
        message: "Identifier can contains only letters, numbers and -",
      },
    ],
    color: [
      {
        type: "enum",
        enum: boardColors,
        message: "This color is not supported by TaskBoard.",
      },
      { required: true, message: "Color is required." },
    ],
  }

  // Items for form inputs
  items = {
    name: {
      label: "Team name",
      name: "name",
      rules: this.rules.name,
      hasFeedback: true,
    },
    identifier: {
      label: "Team identifier",
      name: "identifier",
      dependencies: ["name"],
      rules: this.rules.identifier,
      hasFeedback: true,
    },
    color: {
      label: "Team color",
      name: "color",
      rules: this.rules.color,
    },
  }

  componentDidMount() {
    const { fetchTeam: fetch, edit, team } = this.props

    if (edit && team?._id !== edit) {
      fetch(edit)
    }
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

  handleSubmit = (values) => {
    const {
      team,
      edit,
      updateTeam: updateAction,
      sendTeam: sendAction,
    } = this.props

    if (edit && team?.identifier === edit) {
      updateAction(team.identifier, values)
    } else {
      sendAction(values)
    }
  }

  render() {
    const { error, edit, team, loading } = this.props
    const defaults =
      edit && edit === team?.identifier ? team : this.initialValues

    const spinning = !!loading?.states[SUBJECT_TEAM]

    return (
      <Spin spinning={spinning}>
        {!edit || edit === team?.identifier ? (
          <Form
            ref={this.formRef}
            labelCol={{ span: 18 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            requiredMark={false}
            onFinish={this.handleSubmit}
            initialValues={defaults}
          >
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
            {renderAntItem(
              "color",
              this.items.color,
              error,
              <ColorPicker data={boardColors} />
            )}
            {error && !error.fields && (
              <Typography.Text type="danger">{error.message}</Typography.Text>
            )}
            <FormSubmit title="Save" />
          </Form>
        ) : (
          <EmptyForm />
        )}
      </Spin>
    )
  }
}

TeamForm.propTypes = {
  error: shapes.errors,
  loading: shapes.loading,
  edit: PropTypes.string,
  team: shapes.team,
  sendTeam: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  fetchTeam: PropTypes.func.isRequired,
}

TeamForm.defaultProps = {
  error: null,
  loading: null,
  team: null,
  edit: false,
}

function mapStateToProps({ loading, errors, teams }) {
  const newProps = { loading, team: teams?.team }

  if (errors?.subject === SUBJECT_TEAM) {
    newProps.error = errors.errors
  }
  return newProps
}

export default connect(mapStateToProps, { fetchTeam, sendTeam, updateTeam })(
  TeamForm
)
