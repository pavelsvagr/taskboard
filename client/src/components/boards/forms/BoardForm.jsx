import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchCredentials, sendBoard, SUBJECT_BOARD, SUBJECT_CREDENTIALS } from "actions"

import { Form, Input, Radio, Skeleton, Spin, Switch, Typography } from "antd"

import CredentialsSelect from "components/credentials/forms/CredentialsSelect"
import TeamSelect from "components/teams/forms/TeamSelect"
import { INTERVAL_WEEKS, intervalsOptions } from "helpers/intervalTypes"
import { ASSIGNMENT_PROJECT, assignmentOptions } from "helpers/assignmentTypes"
import PropTypes from "prop-types"
import shapes from "types"
import PrioritiesSelect from "./PrioritiesSelect"
import FormSubmit from "../../comon/inputs/FormSubmit"
import { renderAntItem } from "../../../helpers/forms"

class BoardForm extends Component {
  formRef = React.createRef()

  initialValues = {
    name: "",
    identifier: "",
    intervals: INTERVAL_WEEKS,
    assignment: ASSIGNMENT_PROJECT,
    credentials: null,
    priorities: 3,
    synchronize: false
  }

  // Rules for form validation
  rules = {
    name: [
      { type: "string", message: "Name must be a valid string." },
      { required: true, message: "Name is required." },
      { min: 5, message: "Name must be at least 5 chars long." },
      { max: 100, message: "Name must be max 100 chars long." }
    ],
    identifier: [
      { type: "string", message: "Identifier must be a valid string." },
      { required: true, message: "Identifier is required." },
      { min: 5, message: "Identifier must be at least 5 chars long." },
      { max: 100, message: "Identifier must be max 100 chars long." },
      {
        pattern: /^[a-zA-Z]/,
        message: "Identifier must start with letter"
      },
      {
        pattern: /[a-zA-Z0-9]$/,
        message: "Identifier must end with letter or number"
      },
      {
        pattern: /^([a-zA-Z0-9-])*$/,
        message: "Identifier can contains only letters, numbers and -"
      }
    ],
    timeInterval: [
      {
        type: "enum",
        enum: ["days", "weeks", "months"],
        message: "Interval must be days, weeks or months."
      },
      { required: true, message: "Interval is required." }
    ],
    assignment: [
      {
        type: "enum",
        enum: ["projects", "issues"],
        message: "Assignment must be projects or issues."
      },
      { required: true, message: "Assignment is required." }
    ],
    credentials: [
      {
        required: true,
        message: "Please select or create credentials to support app."
      },
      {
        validator: (rule, value) => {
          const { credentials } = this.props

          if (credentials?.data?.find((item) => item._id === value._id)) {
            return Promise.resolve()
          }
          return Promise.reject(
            new Error(
              "Given credentials are not valid, please select valid credentials."
            )
          )
        }
      }
    ],
    synchronize: [
      {
        type: "boolean",
        message: "Synchronize must be true or false"
      },
      { required: true, message: "Synchronize is required." }
    ]
  }

  // Items for form inputs
  items = {
    name: {
      label: "Board name",
      name: "name",
      rules: this.rules.name,
      hasFeedback: true
    },
    identifier: {
      label: "Identifier",
      name: "identifier",
      dependencies: ["name"],
      rules: this.rules.identifier,
      hasFeedback: true
    },
    intervals: {
      label: "Intervals",
      name: "intervals",
      rules: this.rules.intervals
    },
    assignment: {
      label: "Task type",
      name: "assignment",
      rules: this.rules.assignment
    },
    priorities: {
      label: "Default number of priorities",
      name: "priorities"
    },
    credentials: {
      label: "Credentials to external App",
      name: "credentials",
      rules: this.rules.credentials
    },
    synchronize: {
      label: "Import members from external App",
      name: "synchronize",
      valuePropName: "checked"
    },
    teams: {
      label: "Teams on board",
      name: "teams"
    }
  }

  componentDidMount() {
    const { fetchCredentials: getCredentials } = this.props
    getCredentials()
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
    const { sendBoard: action } = this.props
    values.credentials = values.credentials._id
    const { synchronize } = values
    delete values.synchronize

    action(values, synchronize)
  }

  render() {
    const { error, data, credentials: credentialsData, loading } = this.props
    const defaults = data || this.initialValues

    const spinning = (loading.states[SUBJECT_CREDENTIALS] || loading.states[SUBJECT_BOARD])
    const message = spinning?.message

    return credentialsData  ? (
      <Spin spinning={!!spinning} tip={message}>
        <Form
          ref={this.formRef}
          labelCol={{ span: 18 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          requiredMark={false}
          onFinish={this.handleSubmit}
          initialValues={defaults}
        >
          {renderAntItem("name", this.items.name, error,
            <Input onChange={this.handleChangeName} />
          )}
          {renderAntItem("identifier", this.items.identifier, error,
            <Input />
          )}
          {renderAntItem("intervals", this.items.intervals, error,
            <Radio.Group options={intervalsOptions} />
          )}
          {renderAntItem("assignment", this.items.assignment, error,
            <Radio.Group
              options={assignmentOptions}
              optionType="button"
              buttonStyle="solid"
            />
          )}
          {renderAntItem("priorities", this.items.priorities, error,
            <PrioritiesSelect width={300} />
          )}
          {renderAntItem("credentials", this.items.credentials, error,
            <CredentialsSelect data={credentialsData} />
          )}
          {renderAntItem("synchronize", this.items.synchronize, error,
            <Switch />
          )}
          {renderAntItem("teams", this.items.teams, error,
            <TeamSelect />
           )}
          {error && !error.fields && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
          <FormSubmit title='Create' />
        </Form>
      </Spin>
    ) : (
      <Spin spinning>
        <Skeleton />
      </Spin>
    )
  }
}

BoardForm.propTypes = {
  error: shapes.errors,
  loading: shapes.loading,
  data: shapes.board,
  credentials: shapes.paginate(shapes.credentials),
  sendBoard: PropTypes.func.isRequired,
  fetchCredentials: PropTypes.func.isRequired,
}

BoardForm.defaultProps = {
  credentials: null,
  error: null,
  loading: null,
  data: null,
}

function mapStateToProps({ teams, loading, credentials, errors }) {
  const newProps = { loading, teams: teams?.all, credentials: credentials?.all }
  if (errors?.subject === SUBJECT_BOARD) {
    newProps.error = errors.errors
  }
  return newProps
}

export default connect(mapStateToProps, {
  sendBoard,
  fetchCredentials
})(BoardForm)
