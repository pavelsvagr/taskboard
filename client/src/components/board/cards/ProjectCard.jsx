import React from "react"
import moment from "moment"

import { Card, Descriptions, Skeleton } from "antd"
import PropTypes from "prop-types"

const ProjectCard = ({ project }) => {
  return project ? (
    <Card title={project.title}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item key="id" label="ID">
          {project.id}
        </Descriptions.Item>
        <Descriptions.Item key="url" label="url">
          <a href={project.url}>{project.url}</a>
        </Descriptions.Item>
        <Descriptions.Item key="created" label="created">
          {moment(project.created).format("D. M. YYYY")}
        </Descriptions.Item>
      </Descriptions>
      <p>{project.description}</p>
    </Card>
  ) : (
    <Card title={<Skeleton paragraph={0} />}>
      <Skeleton paragraph={{ rows: 4 }} title={false} />
    </Card>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.objectOf(PropTypes.string).isRequired,
}

export default ProjectCard