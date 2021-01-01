import React, { useState } from "react"

import { Button, Col, Modal, Row } from "antd"
import PropTypes from "prop-types"

const ColorPicker = ({ value, onChange, data }) => {
  const [showModal, setShowModal] = useState()

  const handleChange = (color) => {
    setShowModal(false)
    if (onChange) {
      onChange(color)
    }
  }

  return (
    <div>
      {showModal && (
        <Modal
          width={400}
          visible
          title="Select color"
          onCancel={() => setShowModal(false)}
          footer={false}
        >
          <Row gutter={[24, 24]}>
            {data.map((color) => (
              <Col key={color} span={4} style={{ textAlign: "center" }}>
                {value === color ? (
                  <Button
                    className={`color-picker--selected color-${color}`}
                    shape="circle"
                    size="large"
                    icon={<span />}
                    ghost
                    disabled
                  />
                ) : (
                  <Button
                    className={`color-picker color-${color}`}
                    size="large"
                    shape="circle"
                    ghost
                    onClick={() => handleChange(color)}
                    icon={<span />}
                  />
                )}
              </Col>
            ))}
          </Row>
        </Modal>
      )}
      <div>
        <Button
          className={`fill color-${value}`}
          onClick={() => setShowModal(true)}
          icon={<span />}
        />
      </div>
    </div>
  )
}

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.string),
}

ColorPicker.defaultProps = {
  value: null,
  data: [],
  onChange: null,
}

export default ColorPicker
