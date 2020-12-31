import assignmentTypes from "@shared/constants/assignmentTypes"

export const ASSIGNMENT_PROJECT = assignmentTypes.projects
export const ASSIGNMENT_ISSUE = assignmentTypes.issues

export const assignmentOptions = [
  {
    value: ASSIGNMENT_PROJECT,
    label: "projects",
  },
  {
    value: ASSIGNMENT_ISSUE,
    label: "issues",
  },
]

export const getAssignmentTypeColor = (assignment) => {
  switch (assignment) {
    case ASSIGNMENT_PROJECT:
      return "#3ba5ff"
    case ASSIGNMENT_ISSUE:
      return "#36cfc9"
    default:
      return "default"
  }
}
