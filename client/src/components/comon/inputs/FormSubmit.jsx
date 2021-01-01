import React from "react"
import { Button } from "antd"
import PropTypes from "prop-types"

function FormSubmit({ title, size, inline = false }) {
  return (
    <div className={`form__submit${inline ? "--inline" : ""}`}>
      <Button htmlType="submit" type="primary" size={size}>
        {title}
      </Button>
    </div>
  )
}

FormSubmit.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.string,
  inline: PropTypes.bool,
}

FormSubmit.defaultProps = {
  size: "medium",
  inline: false,
}

export default FormSubmit
