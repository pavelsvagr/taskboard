const moment = require('moment')
const {getDateFromTo} = require("../utils/interval")

module.exports = (date, intervals) => {
  if (!(date instanceof moment)) {
    date = moment(date)
  }

  const [dateFrom, dateTo] = getDateFromTo(date, intervals)
  let fromFormat = "DD. MM."
  fromFormat +=  dateFrom.year() !== dateTo.year() ? ' YYYY' : ''

  switch (intervals) {
    case 'weeks':
      return `${dateFrom.format(fromFormat)} - ${dateTo.format('DD. MM. YYYY')}`
    case 'months':
      return date.format('MM. YYYY')
    default:
      return date.format('DD. MM. YYYY')
  }
}