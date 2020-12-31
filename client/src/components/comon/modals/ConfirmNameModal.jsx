import React from "react"
import { Form, Input, Modal, Typography } from "antd"
import PropTypes from "prop-types"

const ConfirmNameModal = (props) => {
  const { onCancel, onOk, confirmName, title, text, visible, danger } = props

  const [form] = Form.useForm()

  const rules = [
    {
      type: "string",
      required: true,
      validator: (rule, value) => {
        if (value === confirmName) {
          return Promise.resolve()
        }
        return Promise.reject(new Error(`Not same as ${  confirmName}`))
      },
      message: `Not same as ${  confirmName}`
    }
  ]

  return (
    <Modal
      onCancel={onCancel}
      title={title}
      okButtonProps={{ danger }}
      visible={visible}
      onOk={async () => {
        form.submit()
      }}
    >
      <Form form={form} onFinish={onOk}>
        <div style={{ marginBottom: 20 }}>
          {text || (
            <div>
              Type 
              {' '}
              <Typography.Text strong>{confirmName}</Typography.Text>
              :
            </div>
          )}
        </div>
        <Form.Item name="confirm" rules={rules}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

ConfirmNameModal.propTypes = {
  confirmName: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onOk:PropTypes.func,
  title: PropTypes.string,
  text:PropTypes.node,
  visible: PropTypes.bool,
  danger: PropTypes.bool
}

ConfirmNameModal.defaultProps = {
  onCancel: null,
  onOk: null,
  title: "",
  text: "",
  visible: false,
  danger: false
}

export default ConfirmNameModal
