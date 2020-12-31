import "./notifications.sass"

import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { deleteNotification, fetchNotifications, fetchNotificationsCount, SUBJECT_NOTIFICATIONS } from "actions"
import EmptyData from "components/comon/data/EmptyData"
import { Modal, Pagination, Spin, Tag } from "antd"
import LoadingShape from "types/loading"
import NotificationShape from "types/notifications"
import NotificationCard from "./NotificationCard"

class Notifications extends Component {
  componentDidMount() {
    const { fetchNotifications: actionAll, fetchNotificationsCount: actionCount } = this.props
    actionAll()
    actionCount()
  }

  componentWillUnmount() {
    const { fetchNotificationsCount: action } = this.props
    action()
  }

  handleChangePage = (page = 1) => {
    const { fetchNotifications: actionAll, fetchNotificationsCount: actionCount } = this.props
    actionAll(page)
    actionCount()
  }

  render() {
    const { notifications, onClose, loading, count, unread } = this.props

    return (
      <Modal
        visible
        closable
        onCancel={onClose}
        footer={null}
        width={1200}
      >
        <h1>
          Notifications
        </h1>
        <Spin spinning={!!loading?.states[SUBJECT_NOTIFICATIONS]}>
          <div className="notifications__status-bar">
            <Tag color={unread ? "red" : "default"}>
              {`${unread} new`}
            </Tag>
          </div>
          {notifications && notifications.length ? (
            <>
              <div>
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
              <Pagination defaultCurrent={1} total={count} onChange={this.handleChangePage} />
            </>
          ) : (
            <EmptyData description="You have no notification now" />
          )}
        </Spin>
      </Modal>
    )
  }
}

Notifications.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  fetchNotificationsCount: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: LoadingShape,
  notifications: PropTypes.arrayOf(NotificationShape),
  count: PropTypes.number,
  unread: PropTypes.number
}

Notifications.defaultProps = {
  loading: null,
  count: null,
  notifications: null,
  unread: null,
}

function mapStateToProps({ notifications, loading }) {
  return {
    notifications: notifications.notifications,
    unread: notifications.unread,
    count: notifications.count,
    loading
  }
}

export default connect(mapStateToProps, {
  fetchNotifications,
  deleteNotification,
  fetchNotificationsCount
})(Notifications)
