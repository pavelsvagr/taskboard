module.exports = function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length || newIndex < 0 ||
    oldIndex >= arr.length || oldIndex < 0) {
    throw Error("Invalid index")
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}