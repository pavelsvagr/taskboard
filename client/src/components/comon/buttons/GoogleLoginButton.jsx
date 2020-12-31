import React from "react"
import { GoogleOutlined } from "@ant-design/icons"
import { Button } from "antd"

function GoogleLoginButton() {
  return (
    <Button
      className="login"
      href="/auth/google"
      type="primary"
      icon={<GoogleOutlined />}
      size="large"
    >
      Login With Google
    </Button>
  )
}

export default GoogleLoginButton