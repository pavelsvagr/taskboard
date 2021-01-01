export function addToPagination(paginationObject, newObject) {
  const { data, count, limit, offset, sort } = paginationObject || {}

  const newData = data ? [newObject, ...data] : [newObject]

  return {
    data: newData,
    count: count ? count + 1 : newData.length,
    limit: limit || newData.count,
    offset: offset || 0,
    sort,
  }
}

export function removeFromPagination(paginationObject, newObject) {
  const { data, count, limit, offset, sort } = paginationObject || {}

  const newData = data ? data.filter((a) => a._id !== newObject._id) : []

  return {
    data: newData,
    count: count ? count - 1 : newData.length,
    limit: limit || newData.count,
    offset: offset || 0,
    sort,
  }
}

export function updateInPagination(paginationObject, newObject) {
  const { data, count, limit, offset, sort } = paginationObject || {}

  const newData = data
    ? data.map((a) => (a._id === newObject._id ? newObject : a))
    : []

  return {
    data: newData,
    count: count || newData.length,
    limit: limit || newData.count,
    offset: offset || 0,
    sort,
  }
}
