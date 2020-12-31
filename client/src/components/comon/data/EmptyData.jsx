import React from "react"
import { Button, Empty } from "antd"
import PropTypes from "prop-types"
import noData from "../../../images/no_data.png"

function EmptyData({ onClick, title, description, children }) {
  return (
    <Empty image={noData} description={<span>{description}</span>}>
      {onClick && (
        <Button type="primary" onClick={onClick}>
          {title || "Create"}
        </Button>
      )}
      {children}
    </Empty>
  )
}

EmptyData.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node
}

EmptyData.defaultProps = {
  onClick: null,
  title: null,
  description: null,
  children: null
}

export default EmptyData
