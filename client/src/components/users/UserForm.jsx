import React, { Component } from "react"
import { connect } from "react-redux"
import { createUser, SUBJECT_USER, updateUser } from "actions"
import { Form, Input, Radio, Spin } from "antd"
import shapes from "types"
import Roles from "@shared/security/roles"
import PropTypes from "prop-types"
import FormSubmit from "../comon/inputs/FormSubmit"
import { renderAntItem } from "../../helpers/forms"
import { fetchUser } from "../../actions"
import EmptyForm from "../comon/data/EmptyForm"

class UserForm extends Component {
  formRef = React.createRef()

  initialValues = {
    name: "",
    email: "",
    role: Roles.User
  }

  // Rules for form validation
  rules = {
    name: [
      { type: "string", message: "Name must be a valid string." },
      { required: true, message: "Name is required." },
      { min: 3, message: "Name must be at least 3 chars long." },
      { max: 300, message: "Name must be max 300 chars long." }
    ],
    email: [
      { type: "email", message: "Email must be a valid email." },
      { required: true, message: "Email is required." }
    ],
    photo: [
      { type: "url", message: "Photo href must be a valid URL." }
    ],
    role: [
      { type: "string", message: "Role must be a valid role." },
      { required: true, message: "Role is required." }
    ]
  }

  // Items for form inputs
  items = {
    name: {
      label: "Full name",
      name: "name",
      rules: this.rules.name,
      hasFeedback: true
    },
    email: {
      label: "Email",
      name: "email",
      rules: this.rules.email,
      hasFeedback: true
    },
    photo: {
      label: "Avatar url",
      name: "photo",
      rules: this.rules.avatar,
      hasFeedback: true
    },
    role: {
      label: "Role",
      name: "role",
      rules: this.rules.role
    }
  }

  componentDidMount() {
    const { fetchUser: fetch, edit, user } = this.props

    if (edit && user?._id !== edit) {
      fetch(edit)
    }
  }

  handleSubmit = (values) => {
    const { user, edit, updateUser: updateAction, createUser: createAction } = this.props

    if (user && edit) {
      updateAction(user._id, values)
    } else {
      createAction(values)
    }
  }

  render() {
    const { user, loading, error, edit } = this.props
    const defaults = edit ? user || this.initialValues : this.initialValues

    const rolesOptions = Object.values(Roles).map(o => {
      return { label: o, value: o }
    })

    const spinning =
      loading.active !== 0 && loading.states[SUBJECT_USER] !== undefined

    return (
      <Spin spinning={spinning}>
        {(!edit || (user && user._id === edit)) ? (
          <Form
            ref={this.formRef}
            labelCol={{ span: 18 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            requiredMark={false}
            onFinish={this.handleSubmit}
            initialValues={defaults}
          >
            {renderAntItem("name", this.items.name, error, <Input />)}
            {renderAntItem("email", this.items.email, error, <Input />)}
            {renderAntItem("photo", this.items.photo, error, <Input />)}
            {renderAntItem("role", this.items.role, error, (
              <Radio.Group
                options={rolesOptions}
                optionType="button"
                buttonStyle="solid"
              />
            ))}
            <FormSubmit title={edit ? "Save" : "Create"} />
          </Form>
        ) : (
          <EmptyForm />
        )}
      </Spin>
    )
  }
}

UserForm.propTypes = {
  loading: shapes.loading,
  user: shapes.user,
  edit: PropTypes.string,
  fetchUser: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  error: shapes.errors
}

UserForm.defaultProps = {
  loading: null,
  user: null,
  edit: null,
  error: null
}


function mapStateToProps({ users, loading, errors }) {
  return { loading, users: users.all, user: users.user, error: errors?.errors }
}

export default connect(mapStateToProps, { updateUser, fetchUser, createUser })(
  UserForm
)
