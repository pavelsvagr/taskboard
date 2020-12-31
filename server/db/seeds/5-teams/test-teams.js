const { getObjectId } = require("mongo-seeding")

module.exports = [
  {
    "_id": getObjectId("5fccf1cd8ea93f4fcc8c005e"),
    "users": [
      getObjectId("5fccb91bba309524f058e32e"),
      getObjectId("5fccfdc5c6e91e2e984d4659")
    ],
    "name": "Frontend Android",
    "identifier": "frontend-android",
    "color": "darkblue"
  },
  {
    "_id": getObjectId("5fccf1f38ea93f4fcc8c005f"),
    "users": [
      getObjectId("5fccb6375543d1275007c144"),
      getObjectId("5fccb6495543d1275007c145")
    ],
    "name": "Backend Android",
    "identifier": "backend-android",
    "color": "cyan"
  },
  {
    "_id": getObjectId("5fccf2098ea93f4fcc8c0060"),
    "users": [
      getObjectId("5fccb6615543d1275007c146"),
      getObjectId("5fccb689d91f304f38ebf60e"),
      getObjectId("5fccb694d91f304f38ebf60f"),
      getObjectId("5fccb6a3d91f304f38ebf610")
    ],
    "name": "Backend iOS",
    "identifier": "backend-ios",
    "color": "green"
  },
  {
    "_id": getObjectId("5fccf21e8ea93f4fcc8c0061"),
    "users": [
      getObjectId("5fccb8e2ba309524f058e32a"),
      getObjectId("5fccb8efba309524f058e32b"),
      getObjectId("5fccb8fdba309524f058e32c")
    ],
    "name": "Frontend iOS",
    "identifier": "frontend-ios",
    "color": "orange"
  },
  {
    "_id": getObjectId("5fccf2a41a2ecc011c7bcc2a"),
    "users": [
      getObjectId("5fccb6bad91f304f38ebf611"),
      getObjectId("5fccb90aba309524f058e32d")
    ],
    "name": "Backend web",
    "identifier": "backend-web",
    "color": "purple"
  },
  {
    "_id": getObjectId("5fccf30ee73e945608bd7364"),
    "users": [
      getObjectId("5fccf1918ea93f4fcc8c0059"),
      getObjectId("5fccf17a8ea93f4fcc8c0058"),
      getObjectId("5fccb92cba309524f058e32f")
    ],
    "name": "Frontend web",
    "identifier": "frontend-web",
    "color": "red"
  },
  {
    "_id": getObjectId("5fccfe2cc6e91e2e984d465c"),
    "users": [
      getObjectId("5fccb6375543d1275007c144"),
      getObjectId("5fccb6495543d1275007c145"),
      getObjectId("5fccb6615543d1275007c146"),
      getObjectId("5fccb694d91f304f38ebf60f"),
      getObjectId("5fccb689d91f304f38ebf60e"),
      getObjectId("5fccfdc5c6e91e2e984d4659")
    ],
    "name": "Production",
    "identifier": "production",
    "color": "brown"
  },
  {
    "_id": getObjectId("5fccfe45c6e91e2e984d465d"),
    "users": [
      getObjectId("5fccb92cba309524f058e32f"),
      getObjectId("5fccb91bba309524f058e32e"),
      getObjectId("5fccb90aba309524f058e32d"),
      getObjectId("5fccb8fdba309524f058e32c")
    ],
    "name": "Marketing",
    "identifier": "marketing",
    "color": "cyan"
  },
  {
    "_id": getObjectId("5fccfe5dc6e91e2e984d465e"),
    "users": [
      getObjectId("5fccf1918ea93f4fcc8c0059"),
      getObjectId("5fccf17a8ea93f4fcc8c0058"),
      getObjectId("5fccb8efba309524f058e32b")
    ],
    "name": "User Experience",
    "identifier": "user-experience",
    "color": "blue"
  },
  {
    "_id": getObjectId("5fccfeaec6e91e2e984d4664"),
    "users": [
      getObjectId("5fccb6bad91f304f38ebf611"),
      getObjectId("5fccb8e2ba309524f058e32a"),
      getObjectId("5fccb6a3d91f304f38ebf610")
    ],
    "name": "User Interface",
    "identifier": "user-interface",
    "color": "magenta"
  }
]