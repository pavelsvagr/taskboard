import React from "react"
import { Button, Col, Input, Row } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import DataPagination from "./DataPagination"

const FiltersInput = ({ onChange, value }) => {
  const handleNewFilter = () => {
    const newFilter = { name: "", value: "" }
    onChange(value ? [...value, newFilter] : [newFilter])
  }

  const handleEditFilter = (index, filter) => {
    onChange(
      value ? [...value.map((f, i) => (i === index ? filter : f))] : [filter]
    )
  }

  return (
    <div>
      {value && value.map((filter, i) => (
        <Row key={i} gutter={[20, 10]}>
          <Col span={10}>
            <Input
              value={filter.name}
              placeholder="Parameter name"
              onChange={(e) =>
                handleEditFilter(i, {
                  name: e.target.value,
                  value: filter.value,
                })}
            />
          </Col>
          <Col span={10}>
            <Input
              value={filter.value}
              placeholder="Filter value"
              onChange={(e) =>
                handleEditFilter(i, {
                  name: filter.name,
                  value: e.target.value,
                })}
            />
          </Col>
          <Col span={4}>
            <Button
              icon={<DeleteOutlined />}
              onClick={() =>
                onChange([...value.filter((f, index) => index !== i)])}
            />
          </Col>
        </Row>
      ))}
      <Row gutter={[20, 30]}>
        {value?.length ? (
          <Col span={4} offset={20}>
            <Button icon={<PlusOutlined />} onClick={handleNewFilter} />
          </Col>
        ) : (
          <Col span={24} className="text-center">
            <Button
              size="large"
              icon={<PlusOutlined />}
              onClick={handleNewFilter}
            >
              Create new filter for API access
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}

DataPagination.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
}

DataPagination.defaultProps = {
  onChange: null,
  value: null
}

export default FiltersInput
