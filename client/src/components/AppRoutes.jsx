import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect, Route, Router, Switch } from "react-router-dom"
import { Layout, message, notification, Spin } from "antd"
import SiteContent from "components/comon/SiteContent"
import PropTypes from "prop-types"

import Role from "@shared/security/roles"
import isAuthorized from "@shared/security/isAuthorized"

import RedirectShape from "types/redirect"
import UserShape from "types/user"
import FeedbackShape from "types/feedback"
import ErrorsShape from "types/errors"
import * as actions from "actions"
import { Loading3QuartersOutlined } from "@ant-design/icons"
import Landing from "./landing/Landing"
import Navigation from "./navigation/Navigation"
import Board from "./board/Board"
import Boards from "./boards/Boards"
import Teams from "./teams/Teams"
import Credentials from "./credentials/Credentials"
import history from "../helpers/history"
import Users from "./users/Users"

const indicator = (
  <Loading3QuartersOutlined
    style={{ fontSize: 40 }}
    className="logo-spin"
    spin
  />
)
Spin.setDefaultIndicator(indicator)

class AppRoutes extends Component {
  componentDidMount() {
    const { fetchLoggedUser: actionFetchUser } = this.props
    actionFetchUser()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { feedback, redirect, errors } = this.props

    // Check feedback
    if (
      feedback &&
      (!prevProps.feedback || feedback.id !== prevProps.feedback.id)
    ) {
      notification[feedback.type]({
        message: feedback.title,
        description: feedback.description,
      })
    }

    // Check redirects
    if (
      redirect &&
      (!prevProps.redirect || redirect.id !== prevProps.redirect.id)
    ) {
      history.push(redirect.url)
    }

    // Check new errors
    if (errors?.errors && prevProps.errors?.id !== errors.id) {
      if (errors.type === "auth") {
        if (Array.isArray(errors.errors)) {
          for (const e of errors.errors) {
            notification.error({
              message: "Authorization error",
              description: e.msg,
            })
          }
        } else {
          notification.error({
            message: "Authorization error",
            description: errors.errors.msg,
          })
        }
      } else if (Array.isArray(errors.errors)) {
        for (const e of errors.errors) {
          message.error(e.msg)
        }
      } else {
        message.error(errors.errors.msg)
      }
    }
  }

  render() {
    const { auth } = this.props
    const spinning = auth === null
    return (
      <Router history={history}>
        {auth !== false ? (
          <>
            {auth === null ? (
              <div className="fill">
                <Spin spinning>
                  <div className="fill" />
                </Spin>
              </div>
            ) : (
              <>
                <Navigation />
                <Layout.Content>
                  <Spin spinning={spinning} className="fill">
                    <Switch>
                      <Route
                        path="/board/:identifier"
                        render={(props) =>
                          props.match.params.identifier === "new" ? (
                            ""
                          ) : (
                            <Board
                              identifier={props.match.params.identifier}
                              {...props}
                            />
                          )}
                      />
                      <Route
                        path="/boards"
                        render={(props) => (
                          <SiteContent>
                            <Boards {...props} />
                          </SiteContent>
                        )}
                      />
                      <Route
                        path="/teams"
                        render={(props) => (
                          <SiteContent>
                            <Teams {...props} />
                          </SiteContent>
                        )}
                      />
                      {isAuthorized([Role.Admin, Role.Mod], [], auth) && (
                        <Route
                          path="/credentials"
                          render={(props) => (
                            <SiteContent>
                              <Credentials {...props} />
                            </SiteContent>
                          )}
                        />
                      )}
                      {isAuthorized([Role.Admin, Role.Mod], [], auth) && (
                        <Route
                          path="/users"
                          render={(props) => (
                            <SiteContent>
                              <Users {...props} />
                            </SiteContent>
                          )}
                        />
                      )}
                      <Route path="/*">
                        <Redirect to="/boards" />
                      </Route>
                    </Switch>
                  </Spin>
                </Layout.Content>
              </>
            )}
          </>
        ) : (
          <>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <Landing {...props} />}
              />
              <Route path="/*" render={() => <Redirect to="/" />} />
            </Switch>
          </>
        )}
      </Router>
    )
  }
}

AppRoutes.propTypes = {
  redirect: RedirectShape,
  auth: PropTypes.oneOfType([UserShape, PropTypes.bool]),
  feedback: FeedbackShape,
  errors: ErrorsShape,
  authErrors: PropTypes.objectOf(PropTypes.string),
  fetchUser: PropTypes.func.isRequired,
}

AppRoutes.defaultProps = {
  redirect: null,
  auth: null,
  errors: null,
  authErrors: null,
  feedback: null,
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps, actions)(AppRoutes)
