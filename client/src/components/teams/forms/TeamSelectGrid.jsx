import React, { Component } from "react"
import { Avatar, Button, Col, Row, Space, Table } from "antd"
import { lexicalSort } from "helpers/sorting"
import { DeleteOutlined } from "@ant-design/icons"
import EmptyData from "components/comon/data/EmptyData"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import TeamSelect from "./TeamSelect"
import shapes from "../../../types"
import { fetchTeams } from "../../../actions"

class TeamSelectGrid extends Component {
  columns = [
    {
      dataIndex: "name",
      title: "Name",
      sorter: lexicalSort(false, (item) => item.name),
      showSorterTooltip: false,
    },
    {
      dataIndex: "identifier",
      title: "Identifier",
      sorter: lexicalSort(false, (item) => item.identifier),
      showSorterTooltip: false,
      responsive: ["md"],
    },
    {
      dataIndex: "color",
      title: "Color",
      sorter: lexicalSort(false, (item) => item.color),
      showSorterTooltip: false,
      render: (text) => (
        <Avatar
          className={`color-picker--disabled color-${text}`}
          shape="circle"
          icon={<span />}
        />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      showSorterTooltip: false,
      render: (text, record) => (
        <Space>
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => this.handleDeleteTeam(record)}
          />
        </Space>
      ),
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      selectedTeams: [],
    }
  }

  handleDeleteTeam = (team) => {
    const { value, onChange } = this.props
    const valueTeams = value || []
    onChange(valueTeams.filter((i) => i._id !== team._id))
  }

  handleChangeSelected = (selectedTeams) => {
    this.setState({ selectedTeams })
  }

  handleAddSelected = () => {
    const { value, onChange, teams } = this.props
    const { selectedTeams } = this.state

    const newTeams = []
    for (const id of selectedTeams) {
      newTeams.push(teams.find((t) => t._id === id))
    }

    onChange([...value, ...newTeams])
    this.setState({ selectedTeams: [] })
  }

  render() {
    const { value } = this.props
    const { selectedTeams } = this.state

    const disabled = {}
    for (const v of value) {
      disabled[v._id] = true
    }

    return (
      <div>
        <Row gutter={[12, 6]}>
          <Col sm={20} xs={24}>
            <TeamSelect
              value={selectedTeams}
              disabled={disabled}
              placeholder="select teams..."
              onChange={this.handleChangeSelected}
            />
          </Col>
          <Col sm={4} xs={24}>
            <Button onClick={this.handleAddSelected} className="full-width">
              Add
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={value}
          rowKey="_id"
          columns={this.columns}
          size="small"
          footer={null}
          pagination={false}
          locale={{
            emptyText: <EmptyData description="Board uses no team." />,
          }}
        />
      </div>
    )
  }
}

TeamSelectGrid.propTypes = {
  value: PropTypes.arrayOf(shapes.team),
  onChange: PropTypes.func,
  teams: PropTypes.arrayOf(shapes.team),
}

TeamSelectGrid.defaultProps = {
  value: null,
  onChange: null,
  teams: [],
}

function mapStateToProps({ teams }) {
  return { teams: teams?.all?.data }
}

export default connect(mapStateToProps, { fetchTeams })(TeamSelectGrid)
