/* eslint import/no-extraneous-dependencies:0 */
const { expect } = require("chai")
const arrayMove = require("../../../utils/arrayMove")
const tests = require("./data/arrayMove")


describe("Unit: arrayMove", () => {
  for (const testCase of tests) {
    describe(testCase.name, () => {
      for (const test of testCase.tests) {
        it(test.name, (done) => {
          if (test.data.error) {
            expect(
              () => arrayMove(test.data.array, test.data.oldIndex, test.data.newIndex)
            ).to.throw(Error)
          } else if(test.data.expect){
            expect(
              arrayMove(test.data.array, test.data.oldIndex, test.data.newIndex)
            ).to.eql(test.data.expect)
          }
          done()
        })
      }
    })
  }
})
