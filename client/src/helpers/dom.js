export function isChild(element, classname) {
  if (
    typeof element.className !== "object" &&
    element.className.split(" ").indexOf(classname) >= 0
  ) {
    return true
  }
  if (element.tagName !== "HTML") {
    return element.parentNode && isChild(element.parentNode, classname)
  }
  return false
}
