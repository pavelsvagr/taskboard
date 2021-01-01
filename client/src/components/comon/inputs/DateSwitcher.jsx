import React, { Component } from "react"
import moment from "moment"
import momentTypes from "react-moment-proptypes"

import { Button, Col, DatePicker, Row } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

import renderBoardDate from "@shared/format/renderBoardDate"
import PropTypes from "prop-types"

class DateSwitcher extends Component {
  getDatePickerType = (intervals) => {
    switch (intervals) {
      case "weeks":
        return "week"
      case "months":
        return "month"
      default:
        return "date"
    }
  }

  getFormat = (intervals) => {
    switch (intervals) {
      case "weeks":
        return (value) => renderBoardDate(value, intervals)
      case "months":
        return "MM. YYYY"
      default:
        return "DD. MM. YYYY"
    }
  }

  handleNext = () => {
    const { selected, onChange, intervals } = this.props
    const actual = moment(selected)
    const next = actual.add(1, intervals)
    onChange(next)
  }

  handlePrevious = () => {
    const { selected, onChange, intervals } = this.props
    const actual = moment(selected)
    const prev = actual.subtract(1, intervals)
    onChange(prev)
  }

  render() {
    const {
      intervals,
      selected,
      onChange,
      disabled,
      buttonProps,
      ...otherProps
    } = this.props

    return (
      <div>
        <Row gutter={[4, 0]} style={{ justifyContent: "center" }}>
          <Col>
            <Button
              onClick={this.handlePrevious}
              icon={<LeftOutlined />}
              disabled={disabled}
              {...buttonProps}
            />
          </Col>
          <Col>
            <DatePicker
              {...otherProps}
              disabled={disabled}
              value={selected}
              isReadOnly
              allowClear={false}
              format={this.getFormat(intervals)}
              picker={this.getDatePickerType(intervals)}
              onChange={onChange}
            />
          </Col>
          <Col>
            <Button
              onClick={this.handleNext}
              icon={<RightOutlined />}
              disabled={disabled}
              {...buttonProps}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

DateSwitcher.propTypes = {
  selected: PropTypes.oneOfType([momentTypes.momentObj, PropTypes.string]),
  onChange: PropTypes.func,
  intervals: PropTypes.string,
  disabled: PropTypes.bool,
  buttonProps: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  ),
}

DateSwitcher.defaultProps = {
  selected: null,
  onChange: null,
  disabled: false,
  buttonProps: {},
  intervals: null,
}

export default DateSwitcher
