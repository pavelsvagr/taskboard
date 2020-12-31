import React from "react"

import { Col, Row, Slider } from "antd"

import { intervalsOptions } from "helpers/intervalTypes"
import PropTypes from "prop-types"

function IntervalsSlider(props) {
  const { selected, onChange } = props

  const values = {}
  const marks = {}
  let value = 1
  const step = Math.floor(100 / (intervalsOptions.length - 1))

  for (let i = 0; i < intervalsOptions.length; i+=1) {
    marks[i * step] = intervalsOptions[i].label
    values[i * step] = intervalsOptions[i].value
    if (intervalsOptions[i].value === selected) {
      value = i * step
    }
  }
  return (
    <Row style={{ alignItems: "center" }} gutter={[24, 0]}>
      <Col span={8} style={{ textAlign: "right" }}>
        View:
      </Col>
      <Col span={16}>
        <div style={{ width: 150, display: "inline-block" }}>
          <Slider
            marks={marks}
            step={step}
            tooltipVisible={false}
            onChange={(actualValue) => onChange(values[actualValue])}
            defaultValue={value}
          />
        </div>
      </Col>
    </Row>
  )
}

IntervalsSlider.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func,
}

IntervalsSlider.defaultProps = {
  selected: null,
  onChange: null,
}

export default IntervalsSlider
