const moment = require("moment")

function convertToString([fromDate, toDate]) {
  return [fromDate.format("YYYY-MM-DD"), toDate.format("YYYY-MM-DD")]
}

module.exports = [
  {
    name: "getDateFromTo",
    tests: [
      {
        name: "Weeks 1",
        data: {
          functionName: "getDateFromTo",
          params: ["2020-01-01", "weeks"],
          convert: convertToString,
          expect: ["2019-12-30","2020-01-05"]
        }
      },
      {
        name: "Weeks 2",
        data: {
          functionName: "getDateFromTo",
          params: ["2019-12-30", "weeks"],
          convert: convertToString,
          expect: ["2019-12-30","2020-01-05"]
        }
      },
      {
        name: "Months 1",
        data: {
          functionName: "getDateFromTo",
          params: ["2019-12-30", "months"],
          convert: convertToString,
          expect: ["2019-12-01", "2019-12-31"]
        }
      },
      {
        name: "Months 2",
        data: {
          functionName: "getDateFromTo",
          params: [moment("2019-12-01"), "months"],
          convert: convertToString,
          expect: ["2019-12-01", "2019-12-31"]
        }
      },
      {
        name: "Days 2",
        data: {
          functionName: "getDateFromTo",
          params: [moment("2019-12-01"), "days"],
          convert: convertToString,
          expect: ["2019-12-01", "2019-12-01"]
        }
      },
    ]
  },
]