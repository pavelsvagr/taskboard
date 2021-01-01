import React from "react"
import { Badge, Button, Table, Tag, Tooltip } from "antd"
import PropTypes from "prop-types"
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons"

import Role from "@shared/security/roles"
import getRoleColor from "helpers/roles"
import Highlighter from "react-highlight-words"
import { connect } from "react-redux"
import UnlockAccess from "../comon/security/UnlockAccess"
import shapes from "../../types"
import { fetchUsers } from "../../actions"
import DataPagination from "../board/forms/DataPagination"
import { isAntColSorted } from "../../helpers/sorting"

function UsersGrid({
  users,
  empty,
  onDetail,
  onEdit,
  userId,
  search,
  fetchUsers: handleFetch,
}) {
  const searchRenderer = (text) => (
    <Highlighter
      highlightStyle={{ backgroundColor: "#40a9ff", padding: 0 }}
      searchWords={[search]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  )

  const { data = [], limit = 0, offset = 0, count = 0, sort = {} } = users || {}

  const handleTableChange = (pagination, filters, sorter) => {
    const sorting = sorter?.order
      ? `${sorter.field},${sorter.order === "ascend" ? "ASC" : "DESC"}`
      : null
    handleFetch(search, offset, limit, sorting)
  }

  const columns = [
    {
      dataIndex: "name",
      title: "Name",
      sorter: true,
      sortOrder: isAntColSorted(sort, "name"),
      showSorterTooltip: false,
      render: searchRenderer,
    },
    {
      dataIndex: "email",
      title: "Email",
      sorter: true,
      sortOrder: isAntColSorted(sort, "email"),
      showSorterTooltip: false,
      render: searchRenderer,
    },
    {
      dataIndex: "active",
      title: "Active",
      sorter: true,
      sortOrder: isAntColSorted(sort, "active"),
      showSorterTooltip: false,
      responsive: ["md"],
      render: (active) =>
        active ? <Badge status="processing" /> : <Badge status="error" />,
    },
    {
      dataIndex: "role",
      title: "Role",
      sortOrder: isAntColSorted(sort, "role"),
      sorter: true,
      showSorterTooltip: false,
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <div className="table__actions">
          <UnlockAccess globalRoles={[Role.Admin]}>
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onDetail(record)}
            />
          </UnlockAccess>
          {record.active ? (
            <Tooltip title="Deactivate">
              {record.role !== Role.Admin && record._id !== userId && (
                <Button
                  shape="circle"
                  icon={<CloseOutlined />}
                  onClick={() => onEdit({ _id: record._id, active: false })}
                  danger
                />
              )}
            </Tooltip>
          ) : (
            <Tooltip title="Activate">
              {record.role !== Role.Admin && (
                <Button
                  shape="circle"
                  icon={<CheckOutlined />}
                  onClick={() => onEdit({ _id: record._id, active: true })}
                  type="primary"
                />
              )}
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <Table
        rowKey="_id"
        dataSource={data}
        pagination={false}
        onChange={handleTableChange}
        columns={columns}
        locale={{
          emptyText: empty,
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

UsersGrid.propTypes = {
  users: shapes.paginate(shapes.user),
  fetchUsers: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  search: PropTypes.string,
  empty: PropTypes.element,
}

UsersGrid.defaultProps = {
  empty: null,
  search: "",
  users: {},
}

function mapStateToProps({ users }) {
  return { users: users.all }
}

export default connect(mapStateToProps, { fetchUsers })(UsersGrid)
