import Role from "@shared/security/roles"

export default function getRoleColor(role) {
  switch (role) {
    case Role.Mod:
      return "#3ba5ff"
    case Role.Admin:
      return "#36cfc9"
    default:
      return "default"
  }
}
