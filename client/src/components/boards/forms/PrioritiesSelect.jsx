import React from "react"
import { Slider } from "antd"
import PropTypes from "prop-types"

const PrioritiesSelect = ({
  onChange,
  value,
  disabled,
  onAfterChange,
  className,
  width,
  label,
}) => {
  const widthStyle = width || 400

  const otherProps = onAfterChange ? { onAfterChange } : {}
  return (
    <div
      className={className || "text-center"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: label ? "right" : "space-between",
      }}
    >
      {label && (
        <div
          style={{
            display: "inline-block",
            padding: "0 40px",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          maxWidth: widthStyle,
          width: widthStyle,
          display: "inline-block",
          padding: "0 20px",
        }}
      >
        <Slider
          disabled={disabled}
          min={1}
          max={5}
          tooltipVisible={false}
          marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }}
          onChange={onChange}
          value={value}
          {...otherProps}
        />
      </div>
    </div>
  )
}

PrioritiesSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  disabled: PropTypes.bool,
  onAfterChange: PropTypes.func,
  className: PropTypes.string,
  width: PropTypes.number,
  label: PropTypes.string,
}

PrioritiesSelect.defaultProps = {
  onChange: null,
  value: null,
  disabled: null,
  onAfterChange: null,
  className: null,
  width: null,
  label: null,
}

export default PrioritiesSelect
