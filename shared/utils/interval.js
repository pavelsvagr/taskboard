const moment = require('moment')

moment.updateLocale("en", { week: { dow: 1 } })

const getDateFromTo = (date, intervals) => {
    if (! (date instanceof moment)) {
        date = moment(date)
    }

    switch (intervals) {
        case 'days':
            return [date, date]
        case 'weeks':
            return [date.startOf('week'), date.clone().endOf('week')]
        case 'months':
            return [date.startOf('month'), date.clone().endOf('month')]
        default:
            return [date, date]
    }
}

module.exports = {
    getDateFromTo
}