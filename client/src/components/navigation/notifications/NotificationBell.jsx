import React, { Component } from "react"
import { BellFilled } from "@ant-design/icons"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { newNotification } from "actions"
import { Badge, notification } from "antd"

class NotificationBell extends Component {
  componentDidMount() {
    const { newNotification: actionNewNotification } = this.props

    if (typeof EventSource !== "undefined") {
      const eventSource = new EventSource("/api/notifications/stream")
      eventSource.onmessage = (e) => actionNewNotification(JSON.parse(e.data))
    } else {
      notification.warn({
        message:
          "Your device or browser doesnt support live notifications update.",
      })
    }
  }

  render() {
    const { count } = this.props
    const bellProps = count ? { style: { color: "#3ba5ff" } } : {}

    return count ? (
      <Badge count={count} className="anticon alert-count" size="small">
        <BellFilled {...bellProps} />
      </Badge>
    ) : (
      <BellFilled {...bellProps} />
    )
  }
}

NotificationBell.propTypes = {
  count: PropTypes.number,
  newNotification: PropTypes.func.isRequired,
}

NotificationBell.defaultProps = {
  count: null,
}

export default connect(null, { newNotification })(NotificationBell)
