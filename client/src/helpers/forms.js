import { Form } from "antd"
import React from "react"

/**
 * Checks if error is valid for given input
 * @param {object} error
 * @param {string} item
 * @returns {{help: string, validateStatus: string}|null}
 */
export function checkErrorForItem(error, item) {
  if (
    (Array.isArray(error?.param) && error.param.includes(item)) ||
    error?.param === item
  ) {
    return { validateStatus: "error", help: error?.msg }
  }
  return null
}

/**
 * Creates error attributes for Ant Design inputs from received errors.
 * @param {string} item
 * @param {object|array} errors
 */
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

/**
 * Renders ant form item
 * @param {string} name
 * @param {object} itemProps
 * @param {object|array} errors
 * @param {node} component
 */
export function renderAntItem(name, itemProps, errors, component) {
  const itemPropsWithErrors = { ...itemProps, ...errorAttrs(name, errors) }
  return React.createElement(Form.Item, itemPropsWithErrors, component)
}
