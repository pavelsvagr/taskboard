import intervalsTypes from "@shared/constants/intervalsTypes"

export const INTERVAL_DAYS = intervalsTypes.days
export const INTERVAL_WEEKS = intervalsTypes.weeks
export const INTERVAL_MONTHS = intervalsTypes.months

export const intervalsOptions = [
  {
    value: INTERVAL_DAYS,
    label: "Days",
  },
  {
    value: INTERVAL_WEEKS,
    label: "Weeks",
  },
  {
    value: INTERVAL_MONTHS,
    label: "Months",
  },
]

export const getIntervalTypeColor = (interval) => {
  switch (interval) {
    case INTERVAL_DAYS:
      return "#f759ab"
    case INTERVAL_WEEKS:
      return "#9254de"
    default:
      return "#597ef7"
  }
}
