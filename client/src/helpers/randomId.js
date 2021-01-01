let lastId = 0

export default (prefix='id') => {
  lastId+=1
  return `${prefix}${lastId}`
}