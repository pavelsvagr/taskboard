/* eslint react/jsx-filename-extension:0 */
import React from "react"
import ReactDOM from "react-dom"
import fetchMock from "fetch-mock"
import thunk from "redux-thunk"
import configureMockStore from "redux-mock-store"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import Board from "../Board"
import testStore from "../../../helpers/tests/testAdminStore"
import windowMedia from "../../../helpers/tests/windowMedia"

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("Board.jsx", () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it("SMOKE: render", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const store = mockStore(testStore)

    const div = document.createElement("div")
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <Board identifier="test-smoke" location={{ search: "" }} />
        </MemoryRouter>
      </Provider>,
      div
    )
  })
})
