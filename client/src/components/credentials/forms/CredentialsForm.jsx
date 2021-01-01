import React, { Component } from "react"
import { connect } from "react-redux"
import {
  sendCredentials,
  SUBJECT_CREDENTIALS,
  updateCredentials,
} from "actions"

import { Form, Input, Select, Spin, Typography } from "antd"
import redmineLogo from "images/redmine-logo.png"
import PropTypes from "prop-types"
import { renderAntItem } from "../../../helpers/forms"
import { fetchSingleCredentials } from "../../../actions"
import shapes from "../../../types"
import EmptyForm from "../../comon/data/EmptyForm"
import FormSubmit from "../../comon/inputs/FormSubmit"

class CredentialsForm extends Component {
  initialValues = {
    name: "",
    type: null,
    url: "",
    apiKey: "",
  }

  typeOptions = [{ label: "Redmine", value: "redmine", logo: redmineLogo }]

  rules = {
    name: [
      { type: "string", message: "Name must be a valid string." },
      { required: true, message: "Please give a name to your credentials." },
      { min: 5, message: "Name must be at least 5 chars long." },
      { max: 100, message: "Name must be max 100 chars long." },
    ],
    type: [
      {
        type: "enum",
        enum: ["redmine"],
        message: "Type must be a valid string.",
      },
      { required: true, message: "Chose a type." },
    ],
    url: [
      { type: "url", message: "URL to redmine app must be a valid URL." },
      { required: true, message: "URL to redmine app is required." },
    ],
    apiKey: [
      { type: "string", message: "API key must be a valid string." },
      { len: 40, message: "Redmine API key must be 40 chars long." },
      { required: true, message: "Redmine API key is required." },
    ],
  }

  items = {
    name: {
      label: "Credentials name",
      name: "name",
      rules: this.rules.name,
      hasFeedback: true,
    },
    type: {
      label: "Type",
      name: "type",
      rules: this.rules.type,
    },
    url: {
      label: "URL",
      name: "url",
      rules: this.rules.url,
      hasFeedback: true,
    },
    apiKey: {
      label: "API key",
      name: "apiKey",
      rules: this.rules.apiKey,
      hasFeedback: true,
    },
  }

  constructor(props) {
    super(props)

    this.state = {
      credentials: {
        name: "",
        type: "",
        url: "",
        apiKey: "",
      },
    }
  }

  componentDidMount() {
    const { credentials, edit, fetchSingleCredentials: fetch } = this.props

    if (edit && credentials?._id !== edit) {
      fetch(edit)
    }
  }

  handleChangeType = (type) => {
    this.setState({ credentials: { type } })
  }

  renderItem = (name, value, component) => {
    return (
      <Form.Item value={value} {...this.items[name]} {...this.errorAttrs(name)}>
        {component}
      </Form.Item>
    )
  }

  handleSubmit = (values) => {
    const {
      credentials,
      edit,
      sendCredentials: send,
      updateCredentials: update,
    } = this.props

    if (credentials && edit) {
      update(credentials._id, { name: values.name })
    } else {
      send(values)
    }
  }

  render() {
    const { error, credentials, edit, loading } = this.props
    const defaults = edit
      ? credentials || this.initialValues
      : this.initialValues

    const { credentials: data } = this.state

    const selectedType = edit ? data?.type || credentials?.type : data?.type

    const spinning = !!loading?.states[SUBJECT_CREDENTIALS]

    return (
      <Spin spinning={spinning}>
        {!edit || edit === credentials?._id ? (
          <Form
            labelCol={{ span: 18 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            requiredMark={false}
            onFinish={this.handleSubmit}
            initialValues={defaults}
          >
            {renderAntItem("name", this.items.name, error, <Input />)}
            {renderAntItem(
              "type",
              this.items.type,
              error,
              <Select
                onChange={this.handleChangeType}
                placeholder="Please select credentials app"
                disabled={edit}
              >
                {this.typeOptions.map((item) => (
                  <Select.Option
                    value={item.value}
                    key={item.value}
                    placeholder="Credential type"
                  >
                    <img
                      alt={`${item.value} logo`}
                      src={item.logo}
                      className="credentials__logo"
                    />
                    <span className="credentials__label">{item.label}</span>
                  </Select.Option>
                ))}
              </Select>
            )}
            {selectedType === "redmine" && (
              <>
                {renderAntItem(
                  "url",
                  this.items.url,
                  error,
                  <Input disabled={edit} />
                )}
                {!edit &&
                  renderAntItem("apiKey", this.items.apiKey, error, <Input />)}
                {error && !error.fields && (
                  <Typography.Text type="danger">
                    {error.message}
                  </Typography.Text>
                )}
              </>
            )}
            <FormSubmit title={edit ? "Save" : "Create"} />
          </Form>
        ) : (
          <EmptyForm />
        )}
      </Spin>
    )
  }
}

CredentialsForm.propTypes = {
  edit: PropTypes.string,
  sendCredentials: PropTypes.func.isRequired,
  updateCredentials: PropTypes.func.isRequired,
  fetchSingleCredentials: PropTypes.func.isRequired,
  loading: shapes.loading,
  credentials: shapes.credentials,
  error: shapes.errors,
}

CredentialsForm.defaultProps = {
  edit: null,
  loading: null,
  credentials: null,
  error: null,
}

function mapStateToProps({ loading, errors, credentials }) {
  return {
    loading,
    error: errors?.errors,
    credentials: credentials?.credentials,
  }
}

export default connect(mapStateToProps, {
  sendCredentials,
  updateCredentials,
  fetchSingleCredentials,
})(CredentialsForm)
