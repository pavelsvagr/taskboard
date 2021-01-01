/* eslint react/jsx-filename-extension:0 */
import React from "react"
import renderer from "react-test-renderer"
import moment from "moment"
import windowMedia from "../../../helpers/tests/windowMedia"
import ColorPicker from "../inputs/ColorPicker"
import DateSwitcher from "../inputs/DateSwitcher"
import FormSubmit from "../inputs/FormSubmit"
import UserSelect from "../inputs/UserSelect"
import testAdminStore from "../../../helpers/tests/testAdminStore"

describe("Inputs", () => {
  it("Snapshot: ColorPicker.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer
      .create(<ColorPicker data={["white", "blue"]} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: DateSwitcher.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer
      .create(
        <DateSwitcher
          intervals="days"
          selected={moment("2020-10-01")}
          onChange={jest.fn()}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: FormSubmit.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer.create(<FormSubmit title="test submit" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: UserSelect.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer
      .create(
        <UserSelect
          value={[]}
          onChange={jest.fn()}
          data={testAdminStore.users}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
