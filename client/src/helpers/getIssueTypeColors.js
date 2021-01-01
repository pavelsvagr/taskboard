export default function getIssueTypeColor(type) {
  switch (type.toString().toLowerCase()) {
    case "bug":
      return "#ff7875"
    case "task":
      return "#40a9ff"
    case "feature":
      return "#5cdbd3"
    default:
      return "default"
  }
}
