/* eslint react/jsx-filename-extension:0 */
import React from "react"
import ReactDOM from "react-dom"
import fetchMock from "fetch-mock"
import thunk from "redux-thunk"
import configureMockStore from "redux-mock-store"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import renderer from "react-test-renderer"
import Teams from "../Teams"
import testStore from "../../../helpers/tests/testAdminStore"
import testUserStore from "../../../helpers/tests/testUserStore"
import windowMedia from "../../../helpers/tests/windowMedia"

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("Teams.jsx", () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it("SMOKE: render", () => {
    const store = mockStore(testStore)
    Object.defineProperty(window, "matchMedia", windowMedia)

    const div = document.createElement("div")
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <Teams />
        </MemoryRouter>
      </Provider>, div)
  })

  it("Snapshot: Match admin", () => {
    const store = mockStore(testStore)
    Object.defineProperty(window, "matchMedia", windowMedia)

    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: Match user", () => {
    const store = mockStore(testUserStore)
    Object.defineProperty(window, "matchMedia", windowMedia)

    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})