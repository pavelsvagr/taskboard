import React, { Component } from "react"

import { Avatar, Button, Table, Tooltip } from "antd"
import { DeleteOutlined, EditOutlined, TeamOutlined } from "@ant-design/icons"

import Role from "@shared/security/roles"
import UnlockAccess from "components/comon/security/UnlockAccess"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Highlighter from "react-highlight-words"
import shapes from "../../types"
import { fetchTeams } from "../../actions"
import DataPagination from "../board/forms/DataPagination"
import { isAntColSorted } from "../../helpers/sorting"

class TeamsGrid extends Component {

  searchRenderer = (text) => {
    const { search } = this.props

    return (
      <Highlighter
        highlightStyle={{ backgroundColor: "#40a9ff", padding: 0 }}
        searchWords={[search]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { teams, search, fetchTeams: handleFetch } = this.props
    const { offset = 0, limit = 0 } = teams

    const sorting = sorter?.order ? `${sorter.field},${sorter.order === "ascend" ? "ASC" : "DESC"}` : null
    handleFetch(search, offset, limit, sorting)
  }

  render = () => {
    const { teams, empty, search, fetchTeams: handleFetch } = this.props
    const { offset = 0, limit = 0, count = 0, data = [], sort = {} } = teams

    const columns = [
      {
        dataIndex: "name",
        title: "Name",
        sorter: true,
        sortOrder: isAntColSorted(sort, "name"),
        showSorterTooltip: false,
        render: this.searchRenderer
      },
      {
        dataIndex: "identifier",
        title: "Identifier",
        sorter: true,
        sortOrder: isAntColSorted(sort, "identifier"),
        showSorterTooltip: false,
        responsive: ["md"],
        render: this.searchRenderer
      },
      {
        dataIndex: "color",
        title: "Color",
        sorter: true,
        sortOrder: isAntColSorted(sort, "color"),
        showSorterTooltip: false,
        render: (text) => (
          <Avatar
            className={`color-picker--disabled color-${text}`}
            shape="circle"
            icon={<span />}
          />
        )
      },
      {
        title: "Actions",
        key: "action",
        render: (text, record) => {
          const { onShowMembers, onEdit, onDelete } = this.props

          return (
            <div className="table__actions">
              <Tooltip title="Members">
                <Button
                  shape="circle"
                  icon={<TeamOutlined />}
                  onClick={() => onShowMembers(record.identifier)}
                />
              </Tooltip>
              <UnlockAccess globalRoles={[Role.Admin, Role.Mod]}>
                <Tooltip title="Edit team">
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(record.identifier)}
                  />
                </Tooltip>
                <Tooltip title="Delete team">
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(record.identifier)}
                    danger
                  />
                </Tooltip>
              </UnlockAccess>
            </div>
          )
        }
      }
    ]


    return (
      <>
        <Table
          rowKey="_id"
          dataSource={data}
          pagination={false}
          onChange={this.handleTableChange}
          columns={columns}
          locale={{
            emptyText: empty
          }}
        />
        <div className="text-center p-sm">
          <DataPagination
            offset={offset}
            limit={limit}
            count={count}
            search={search}
            onFetch={handleFetch}
            size="medium"
            showSizeChanger
          />
        </div>
      </>
    )
  }
}


TeamsGrid.propTypes = {
  teams: shapes.paginate(shapes.team),
  fetchTeams: PropTypes.func.isRequired,
  empty: PropTypes.node,
  search: PropTypes.string,
  onShowMembers: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

TeamsGrid.defaultProps = {
  teams: {},
  search: "",
  empty: null
}

function mapStateToProps({ teams, loading }) {
  return { teams: teams?.all, loading }
}

export default connect(mapStateToProps, { fetchTeams })(TeamsGrid)
