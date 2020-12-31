const {getDateFromTo} = require("../utils/interval")
const moment = require('moment')

module.exports = (date, intervals) => {
    if (! (date instanceof moment)) {
        date = moment(date)
    }

    switch (intervals) {
        case 'weeks':
            const [dateFrom, dateTo] = getDateFromTo(date, intervals)

            let fromFormat = 'DD. MM.'
            fromFormat += dateFrom.year() !== dateTo.year() ? ' YYYY' : ''
            return dateFrom.format(fromFormat) + ' - ' + dateTo.format('DD. MM. YYYY')
        case 'months':
            return date.format('MM. YYYY')
        default:
            return date.format('DD. MM. YYYY')
    }
}