import React from "react"
import { Button } from "antd"
import PropTypes from "prop-types"

function FormSubmit({ title, size }) {
  return (
    <div className="form__submit">
      <Button htmlType="submit" type="primary" size={size}>
        {title}
      </Button>
    </div>
  )
}

FormSubmit.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.string,
}

FormSubmit.defaultProps = {
  size: "medium",
}

export default FormSubmit
