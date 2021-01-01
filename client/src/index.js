import "antd/dist/antd.less"

import "./index.sass"
import React from "react"
import ReactDOM from "react-dom"
import moment from "moment"
import { Provider } from "react-redux"
import App from "./components/AppRoutes"
import store from "./store"

moment.updateLocale("en", {
  week: { dow: 1 },
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
