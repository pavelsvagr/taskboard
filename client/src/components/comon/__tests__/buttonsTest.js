/* eslint react/jsx-filename-extension:0 */
import React from "react"
import renderer from "react-test-renderer"
import windowMedia from "../../../helpers/tests/windowMedia"
import AddButton from "../buttons/AddButton"
import DragButton from "../buttons/DragButton"
import GoogleLoginButton from "../buttons/GoogleLoginButton"
import HelpButton from "../buttons/HelpButton"
import ActionButtons from "../buttons/ActionButtons"

describe("Buttons", () => {
  it("Snapshot: AddButton.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer.create(<AddButton onClick={jest.fn()} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: DragButton.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer
      .create(
        <DragButton provider={{ dragHandleProps: {} }} onClick={jest.fn()} />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: GoogleLoginButton.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer.create(<GoogleLoginButton />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: HelpButton.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer.create(<HelpButton onClick={jest.fn()} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("Snapshot: ActionButtons.jsx", () => {
    Object.defineProperty(window, "matchMedia", windowMedia)
    const tree = renderer
      .create(
        <ActionButtons>
          <button type="submit">test button</button>
        </ActionButtons>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
