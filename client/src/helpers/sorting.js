export const lexicalSort = (caseSensitive = true, get) => {
  if (caseSensitive) {
    return (a, b) => get(a).localeCompare(get(b))
  }
  return (a, b) => get(a).toLowerCase().localeCompare(get(b).toLowerCase())
}

export const numericSort = (get) => (a, b) => get(a) - get(b)

export const antSortToString = (sorter) => sorter?.order ? `${sorter.field},${sorter.order === "ascend" ? "ASC" : "DESC"}` : null

export const sortToString = (sort) => {
  if (! sort) return null

  const name = Object.keys(sort)[0]
  return  `${name},${sort[name] === 1 ? "ASC" : "DESC"}`
}

export const isAntColSorted = (sort, column) => {
  if (sort[column]) {
    return sort[column] === 1 ? "ascend" : "descend"
  }
  return false
}
