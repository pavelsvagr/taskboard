import { Form } from "antd"
import React from "react"

export function checkErrorForItem(error, item) {
  if (
    (Array.isArray(error?.param) && error.param.includes(item)) ||
    error?.param === item
  ) {
    return { validateStatus: "error", help: error?.msg }
  }
  return null
}


export function errorAttrs(item, errors) {
  if (Array.isArray(errors)) {
    for (const error of errors) {
      const result = checkErrorForItem(error, item)
      if (result) {
        return result
      }
    }
  } else {
    const result = checkErrorForItem(errors, item)
    if (result) {
      return result
    }
  }
  return {}
}

export function renderAntItem(name, itemProps, errors, component) {
  const itemPropsWithErrors = {...itemProps,...errorAttrs(name, errors)}
  return React.createElement(Form.Item, itemPropsWithErrors, component)
}