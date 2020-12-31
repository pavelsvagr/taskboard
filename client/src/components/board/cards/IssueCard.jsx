import React from "react"
import moment from "moment"

import { Card, Descriptions, Skeleton, Tag } from "antd"
import { getIssueTypeColor } from "helpers/issueTypeColors"
import PropTypes from "prop-types"
import ProjectCard from "./ProjectCard"

const IssueCard = ({ issue }) => {
  return issue ? (
    <Card
      title={issue.title}
      extra={<Tag color={getIssueTypeColor(issue.type)}>{issue.type}</Tag>}
      className="card--full-content"
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
            <Tag>
              <a href={issue.status}>{issue.status}</a>
            </Tag>
          </Descriptions.Item>
        )}
        <Descriptions.Item key="url" label="url">
          <a href={issue.url}>{issue.url}</a>
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

ProjectCard.propTypes = {
  issue: PropTypes.objectOf(PropTypes.string).isRequired,
}

export default IssueCard
