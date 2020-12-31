import React, { Component } from "react"
import { Link, NavLink, withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Affix, Badge, Button, Layout, Menu, Spin } from "antd"
import {
  AppstoreOutlined,
  CloseOutlined,
  KeyOutlined,
  LoadingOutlined,
  MenuOutlined,
  PoweroffOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons"
import PropTypes from "prop-types"

import Role from "@shared/security/roles"
import isAuthorized from "@shared/security/isAuthorized"

import { fetchLoggedUser, newNotification } from "actions"
import "./navigation.sass"
import { compose } from "redux"
import UserShape from "types/user"
import Notifications from "./notifications/Notifications"
import { fetchNotificationsCount } from "../../actions"
import NotificationBell from "./notifications/NotificationBell"
import UserAvatar from "../comon/UserAvatar"

class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notificationsModal: false,
      visible: false
    }
  }

  componentDidMount() {
    const { fetchNotificationsCount: actionNotifications } = this.props
    actionNotifications()
  }

  handleToggleVisible = () => {
    const { visible } = this.state
    this.setState({ visible: !visible })
  }

  handleHide = () => this.setState({ visible: false })

  handleToggleNotifications = () => {
    const { notificationsModal } = this.state
    this.setState({ notificationsModal: !notificationsModal })
  }

  render() {
    const { auth, notificationsCount, location } = this.props
    const { visible, notificationsModal } = this.state

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    let selected
    switch (true) {
      case notificationsModal:
        selected = "/notifications"
        break
      case location.pathname.startsWith("/boards"):
        selected = "/boards"
        break
      case location.pathname.startsWith("/credentials"):
        selected = "/credentials"
        break
      case location.pathname.startsWith("/teams"):
        selected = "/teams"
        break
      case location.pathname.startsWith("/users"):
        selected = "/users"
        break
      default:
        selected = ""
    }

    const collapsed = !visible
    const { Sider } = Layout

    let className = "nav"
    className += visible ? "--active" : ""

    return auth === null ? (
      <Spin indicator={antIcon} />
    ) : (
      auth && (
        <>
          {collapsed && (
            <Affix
              className="nav__button"
            >
              <Button type="primary" size="large" onClick={this.handleToggleVisible}>
                {notificationsCount ? (
                  <Badge style={{ boxShadow: "none" }} dot>
                    <MenuOutlined />
                  </Badge>
                ) : (
                  <MenuOutlined />
                )}
              </Button>
            </Affix>
          )}
          <Sider
            className={className}
            collapsible
            collapsed={collapsed}
            onCollapse={this.handleToggleVisible}
            width={200}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              zIndex: 90
            }}
          >
            <Affix
              className="nav__button"
              style={{ position: "absolute", top: 10, right: 30 }}
              onClick={this.handleToggleVisible}
            >
              <Button type="primary" size="large" ghost>
                <CloseOutlined />
              </Button>
            </Affix>
            <div
              className="text-center"
              style={{ margin: 10 }}
            >
              <Link to="/boards" onClick={this.handleHide}>
                <div className="logo" />
              </Link>
            </div>
            <Menu
              style={{ paddingBottom: 40 }}
              selectedKeys={selected}
              mode="inline"
              theme="dark"
              onClick={this.handleHide}
            >
              <Menu.Item
                key="/boards"
                icon={<AppstoreOutlined />}
              >
                <NavLink to="/boards">Boards</NavLink>
              </Menu.Item>
              <Menu.Item
                key="/teams"
                icon={<TeamOutlined />}
              >
                <NavLink to="/teams">Teams</NavLink>
              </Menu.Item>

              {isAuthorized([Role.Admin, Role.Mod], [], auth) && (
                <Menu.Item
                  key="/users"
                  icon={<UserOutlined />}
                >
                  <NavLink to="/users">Users</NavLink>
                </Menu.Item>
              )}
              {isAuthorized([Role.Admin, Role.Mod], [], auth) && (
                <Menu.Item
                  key="/credentials"
                  icon={<KeyOutlined />}
                >
                  <NavLink to="/credentials">Credentials</NavLink>
                </Menu.Item>
              )}

              <div style={{ margin: 10 }} className="text-center">
                <UserAvatar user={auth} className={`nav__avatar ${visible ? "size-lg" : ""}`} />
              </div>
              <Menu.Item
                key="/notifications"
                icon={<NotificationBell count={visible || notificationsModal ? null : notificationsCount} />}
                onClick={this.handleToggleNotifications}
              >
                {notificationsCount ? (
                  <Badge
                    style={{ boxShadow: "none" }}
                    count={notificationsCount}
                  >
                    <span style={{ paddingRight: 10, color: "white" }}>
                      Notifications
                    </span>
                  </Badge>
                ) : (
                  "Notifications"
                )}
              </Menu.Item>
              <Menu.Item key="/logout" icon={<PoweroffOutlined />}>
                <a href="/api/logout">Logout</a>
              </Menu.Item>
            </Menu>
          </Sider>
          {notificationsModal && (
            <Notifications onClose={this.handleToggleNotifications} />
          )}
        </>
      )
    )
  }
}

Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  auth: PropTypes.oneOfType([UserShape, PropTypes.bool]),
  notificationsCount: PropTypes.number,
  fetchNotificationsCount: PropTypes.func.isRequired
}

Navigation.defaultProps = {
  auth: null,
  notificationsCount: null
}

function mapStateToProps({ auth, notifications }) {
  return { auth, notificationsCount: notifications?.unread }
}

export default compose(withRouter, connect(mapStateToProps, {
  fetchUser: fetchLoggedUser,
  newNotification,
  fetchNotificationsCount
}))(Navigation)
