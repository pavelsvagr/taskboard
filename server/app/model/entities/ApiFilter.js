const Entity = require("./Entity")

class ApiFilter extends Entity {
  constructor(name, value) {
    super()
    this.name = name
    this.value = value
  }
}

module.exports = ApiFilter