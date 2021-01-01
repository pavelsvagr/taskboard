import React from "react"
import moment from "moment"

import { Card, Descriptions, Skeleton, Tag } from "antd"
import { getIssueTypeColor } from "helpers/issueTypeColors"
import PropTypes from "prop-types"

const IssueCard = ({ issue, className = "", onClick }) => {
  return issue ? (
    <Card
      onClick={onClick}
      title={issue.title}
      extra={<Tag color={getIssueTypeColor(issue.type)}>{issue.type}</Tag>}
      className={`card--full-content ${className}`}
    >
      <Descriptions
        size="small"
        column={1}
        bordered
        className="card__descriptions--bordered"
      >
        <Descriptions.Item key="id" label="ID">
          {issue.id}
        </Descriptions.Item>
        {issue.status && (
          <Descriptions.Item key="status" label="status">
            <Tag>{issue.status}</Tag>
          </Descriptions.Item>
        )}
        <Descriptions.Item key="url" label="url">
          <a href={issue.url} target="_blank" rel="noopener noreferrer">
            {issue.url}
          </a>
        </Descriptions.Item>
        {issue.author && (
          <Descriptions.Item key="author" label="author">
            {issue.author}
          </Descriptions.Item>
        )}
        {issue.assignee && (
          <Descriptions.Item key="assignee" label="assignee">
            {issue.assignee}
          </Descriptions.Item>
        )}
        <Descriptions.Item key="created" label="created">
          {moment(issue.created).format("D. M. YYYY")}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  ) : (
    <Card title={<Skeleton paragraph={0} />}>
      <Skeleton paragraph={{ rows: 4 }} title={false} />
    </Card>
  )
}

IssueCard.propTypes = {
  issue: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

IssueCard.defaultProps = {
  className: "",
  onClick: null,
}

export default IssueCard
