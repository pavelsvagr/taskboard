import React, { Component } from "react"
import { Route } from "react-router-dom"
import { connect } from "react-redux"
import { Modal } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import {
  deleteCredentials,
  fetchCredentials,
  fetchLoggedUser,
  sendCredentials,
  updateCredentials,
} from "../../actions"

import CredentialsForm from "./forms/CredentialsForm"
import CredentialsBox from "./CredentialsBox"
import shapes from "../../types"
import history from "../../helpers/history"

class Credentials extends Component {
  componentDidMount() {
    const { fetchCredentials: fetch } = this.props
    fetch()
  }

  handleShowForm = (credential) => {
    if (!credential) {
      history.push("/credentials/new")
    } else {
      history.push(`/credentials/${credential._id}`)
    }
  }

  handleDeleteCredentials = (credentials) => {
    const { deleteCredentials: deleteAction } = this.props
    deleteAction(credentials._id)
  }

  render() {
    const { credentials } = this.props
    const data = credentials || []

    return (
      <>
        <h1>Credentials</h1>
        {data && (
          <Route
            exact
            path="/credentials/:id"
            render={({ match }) => {
              const { id } = match.params
              const edit = id === "new" ? null : id
              return (
                <Modal
                  title={edit === null ? "New credentials" : "Edit credentials"}
                  visible
                  footer={null}
                  closable
                  onCancel={() => history.push("/credentials")}
                >
                  <CredentialsForm edit={edit} />
                </Modal>
              )
            }}
          />
        )}
        <CredentialsBox
          onNew={() => this.handleShowForm(null)}
          sizing={{ xs: 24, sm: 24, xl: 6, md: 12 }}
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 },
          ]}
          actions={[
            { key: "edit", icon: EditOutlined, onClick: this.handleShowForm },
            {
              key: "edit",
              icon: DeleteOutlined,
              onClick: this.handleDeleteCredentials,
            },
          ]}
        />
      </>
    )
  }
}

Credentials.propTypes = {
  fetchCredentials: PropTypes.func.isRequired,
  deleteCredentials: PropTypes.func.isRequired,
  credentials: PropTypes.arrayOf(shapes.credentials),
}

Credentials.defaultProps = {
  credentials: null,
}

function mapStateToProps({ credentials, auth }) {
  return { credentials: credentials?.all?.data || null, auth }
}

export default connect(mapStateToProps, {
  fetchUser: fetchLoggedUser,
  fetchCredentials,
  sendCredentials,
  updateCredentials,
  deleteCredentials,
})(Credentials)
