import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"

import { Col, Divider, Row, Spin, Typography } from "antd"
import { FrownOutlined, LoadingOutlined } from "@ant-design/icons"
import "./landing.sass"
import UserShape from "types/user"
import PropTypes from "prop-types"
import { fetchAuthErrors, fetchLoggedUser } from "actions"
import GoogleLoginButton from "../comon/buttons/GoogleLoginButton"

class Landing extends Component {
  componentDidMount() {
    const { fetchAuthErrors: action } = this.props
    action()
  }

  render() {
    const { auth, authErrors } = this.props

    const { Title } = Typography
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    switch (auth) {
      case null:
        return <Spin indicator={antIcon} />
      case false:
        return (
          <div className="landing" style={{ textAlign: "center" }}>
            <Row
              justify="center"
              align="middle"
              className="fill flex-center"
              style={{ marginTop: -20 }}
            >
              <Col span={24}>
                <Row>
                  <Col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={8}
                    className="landing__logo-container"
                  >
                    <div className="landing__logo" />
                  </Col>
                  <Col xs={24} sm={24} md={16} lg={12} xl={10}>
                    <Title level={1} className="landing__title">
                      <span>Task</span>
                      <span className="landing__title--low">board</span>
                      {authErrors && (
                        <>
                          <div className="landing__title--error">
                            {authErrors.message} 
                            {' '}
                            <FrownOutlined />
                          </div>
                          <div className="landing__title--error-description">
                            Contact administrator or log in with another
                            account.
                          </div>
                        </>
                      )}
                    </Title>
                    <Divider />
                    <GoogleLoginButton />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )
      default:
        return <Redirect to="/boards" />
    }
  }
}

Landing.propTypes = {
  auth: PropTypes.oneOfType([UserShape, PropTypes.bool]),
  authErrors: PropTypes.objectOf(PropTypes.string),
  fetchAuthErrors: PropTypes.func.isRequired,
}

Landing.defaultProps = {
  auth: null,
  authErrors: null,
}

function mapStateToProps({ auth, authErrors }) {
  return { auth, authErrors }
}

export default connect(mapStateToProps, {
  fetchUser: fetchLoggedUser,
  fetchAuthErrors,
})(Landing)
