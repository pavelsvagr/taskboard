/* eslint react/jsx-filename-extension: 0 */

import React from "react"
import ReactDOM from "react-dom"
import fetchMock from "fetch-mock"
import thunk from "redux-thunk"
import configureMockStore from "redux-mock-store"
import { Provider } from "react-redux"
import renderer from "react-test-renderer"
import App from "../App"
import windowMedia from "../../helpers/tests/windowMedia"
import testStore from "../../helpers/tests/testAdminStore"

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("App.jsx", () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it("SMOKE: Render with login", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    fetchMock.getOnce("/api/user", {
      body: { email: "test@example.org", name: "Test", role: "admin" },
      headers: { "content-type": "application/json" },
    })

    const store = mockStore(testStore)
    const div = document.createElement("div")
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      div
    )
  })

  it("SMOKE: Render without login", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    fetchMock.getOnce("/api/user", {
      status: 401,
    })
    const store = mockStore({
      auth: null,
      boards: {},
    })
    const div = document.createElement("div")
    // eslint-disable-next-line react/jsx-filename-extension
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      div
    )
  })

  it("Snapshot: Render with login", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    fetchMock.getOnce("/api/user", {
      body: { email: "test@example.org", name: "Test", role: "admin" },
      headers: { "content-type": "application/json" },
    })
    const store = mockStore(testStore)

    // eslint-disable-next-line react/jsx-filename-extension
    const tree = renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: Render without login", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    fetchMock.getOnce("/api/user", {
      status: 401,
    })
    const store = mockStore({
      auth: null,
      boards: {},
    })
    // eslint-disable-next-line react/jsx-filename-extension
    const tree = renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
