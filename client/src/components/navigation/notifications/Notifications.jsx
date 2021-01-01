import "./notifications.sass"

import React, {Component} from "react"
import {connect} from "react-redux"
import PropTypes from "prop-types"

import {deleteNotification, fetchNotifications, fetchNotificationsCount, SUBJECT_NOTIFICATIONS,} from "actions"
import EmptyData from "components/comon/data/EmptyData"
import {Modal, Spin, Tag} from "antd"
import NotificationCard from "./NotificationCard"
import DataPagination from "../../board/forms/DataPagination"
import shapes from "../../../types"

class Notifications extends Component {
  componentDidMount() {
    const {
      fetchNotifications: actionAll,
      fetchNotificationsCount: actionCount,
    } = this.props
    actionAll()
    actionCount()
  }

  componentWillUnmount() {
    const {fetchNotificationsCount: action} = this.props
    action()
  }

  handleChangePage = (page, perPage) => {
    const {
      fetchNotifications: actionAll,
      fetchNotificationsCount: actionCount,
    } = this.props
    actionAll(page, perPage)
    actionCount()
  }

  render() {
    const {notifications, onClose, loading, unread} = this.props
    const {data = [], limit = 0, offset = 0, count = 0} = notifications || {}

    return (
      <Modal visible closable onCancel={onClose} footer={null} width={1200}>
        <h1>Notifications</h1>
        <Spin spinning={!!loading?.states[SUBJECT_NOTIFICATIONS]}>
          <div className="notifications__status-bar">
            <Tag color={unread ? "red" : "default"}>{`${unread} new`}</Tag>
          </div>
          {data?.length ? (
            <>
              <div>
                {data.map((notification) => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
              <div className="text-center">
                <DataPagination
                  search={null}
                  count={count}
                  limit={limit}
                  offset={offset}
                  onFetch={this.handleChangePage}
                  showSizeChanger
                />
              </div>
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
  loading: shapes.loading,
  notifications: shapes.paginate(shapes.notifications),
  unread: PropTypes.number,
}

Notifications.defaultProps = {
  loading: null,
  notifications: null,
  unread: null,
}

function mapStateToProps({notifications, loading}) {
  return {
    notifications: notifications?.all,
    unread: notifications.unread,
    loading,
  }
}

export default connect(mapStateToProps, {
  fetchNotifications,
  deleteNotification,
  fetchNotificationsCount,
})(Notifications)
