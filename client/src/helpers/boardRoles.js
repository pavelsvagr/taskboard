import boardRole from "@shared/security/rolesBoard"

export default function getBoardRoleColor(role) {
  switch (role) {
    case boardRole.Mod:
      return "#3ba5ff"
    case boardRole.Owner:
      return "#36cfc9"
    default:
      return "default"
  }
}
