import React from "react"
import moment from "moment"
import { Button, Card, Col, Row } from "antd"
import { connect } from "react-redux"
import { CloseOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import { deleteNotification } from "../../../actions"
import NotificationShape from "../../../types/notifications"

function NotificationCard({ notification, deleteNotification: deleteAction }) {
  return (
    <Card
      title={notification.title}
      bordered={false}
      className={`notification${  notification.visited ? "" : "--new"}`}
      size="small"
      extra={(
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => deleteAction(notification._id)}
          shape="circle"
        />
      )}
    >
      <p>{notification.message}</p>
      <Row>
        <Col span={12} className="notification__description">
          {moment(notification.createdAt).format("DD. MM. YYYY")}
        </Col>
        <Col span={12} className="text-right">
          <Button href={notification.link}>{notification.linkText}</Button>
        </Col>
      </Row>
    </Card>
  )
}

NotificationCard.propTypes = {
  notification: NotificationShape.isRequired,
  deleteNotification: PropTypes.func.isRequired
}

export default connect(null, { deleteNotification })(NotificationCard)
