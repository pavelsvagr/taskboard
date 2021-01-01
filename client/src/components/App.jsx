import React from "react"
import { Layout, Spin } from "antd"
import { Loading3QuartersOutlined } from "@ant-design/icons"
import AppRoutes from "./AppRoutes"

const indicator = (
  <Loading3QuartersOutlined
    style={{ fontSize: 40 }}
    className="logo-spin"
    spin
  />
)
Spin.setDefaultIndicator(indicator)

function App() {
  return (
    <Layout className="layout fill">
      <AppRoutes />
    </Layout>
  )
}

export default App
