import React from "react"
import { Descriptions } from "antd"
import HelpModal from "../../comon/modals/HelpModal"

function FiltersHelp() {
  return (
    <HelpModal title="Taskboard API filters">
      <p>
        API filters are used in every query that is fetching tasks (issues,
        projects) from your ticket app.
      </p>
      <p>
        Each type of app can has its own API filters, so use filters carefully.
      </p>
      <h3>Redmine</h3>
      <p>
        Redmine API have lots of filters described in its
        {" "}
        <a href="https://www.redmine.org/projects/redmine/wiki/rest_api">
          documentation
        </a>
        .
      </p>
      <p>
        For list of filters againts
        <strong> issues </strong>
        you can follow
        {" "}
        <a href="https://www.redmine.org/projects/redmine/wiki/Rest_Issues">
          issues endpoint documentation
        </a>
        .
      </p>
      <p>
        For list of filters againts
        <strong> projects </strong>
        you can follow
        {" "}
        <a href="https://www.redmine.org/projects/redmine/wiki/Rest_Projects">
          issues endpoint documentation
        </a>
        .
      </p>
      <p>
        Redmine documentation has not complete list of filters, that you can
        use. API endpoints also use same filters, that you can find in URL when
        you search inside Redmine app. For example you can use status_id or
        parent_id fields with Redmine values to filter projects or issues by
        status or parent tasks and projects.
      </p>
      <p>
        Example setup for filtering only active projects, that has no parent:
      </p>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="parent_id">!*</Descriptions.Item>
        <Descriptions.Item label="stauts">1</Descriptions.Item>
      </Descriptions>
    </HelpModal>
  )
}

export default FiltersHelp
