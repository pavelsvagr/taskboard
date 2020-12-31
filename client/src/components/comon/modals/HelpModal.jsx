import React, { useState } from "react"
import PropTypes from "prop-types"
import { Modal } from "antd"
import HelpButton from "../buttons/HelpButton"

function HelpModal({ children, title }) {
  const [showed, setShowed] = useState(false)

  return (
    <>
      <Modal onCancel={() => setShowed(false)} visible={showed} title={title} footer={null}>
        {children}
      </Modal>
      <HelpButton onClick={() => setShowed(!showed)} />
    </>
  )
}

HelpModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}

HelpModal.defaultProps = {
  title: "help"
}

export default HelpModal