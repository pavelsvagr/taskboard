/* eslint import/no-extraneous-dependencies:0 */
const { expect } = require("chai")
const intervalTest = require("../../../utils/interval")
const tests = require("./data/interval")


describe("Unit: arrayMove", () => {
  for (const testCase of tests) {
    describe(testCase.name, () => {
      for (const test of testCase.tests) {
        const { functionName, params } = test.data

        it(test.name, (done) => {
          if (test.data.error) {
            expect(
              () => intervalTest[functionName](...params)
            ).to.throw(Error)
          } else if (test.data.expect) {
            let res = intervalTest[functionName](...params)
            if (test.data.convert) {
              res = test.data.convert(res)
            }
            expect(res).to.eql(test.data.expect)
          }
          done()
        })
      }
    })
  }
})
