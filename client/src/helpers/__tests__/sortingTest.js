import * as sorting from "../sorting"

describe("UNIT: sortingTest.js", () => {
  describe("lexicalSort", () => {
    it("case insensitive", () => {
      const lexicalSortI = sorting.lexicalSort(false, (val) => val)
      expect(["a", "b", "c"].sort(lexicalSortI)).toStrictEqual(["a", "b", "c"])
      expect(["a", "c", "a"].sort(lexicalSortI)).toStrictEqual(["a", "a", "c"])
      expect(["a", "c", "b"].sort(lexicalSortI)).toStrictEqual(["a", "b", "c"])
      expect(["a", "C", "b"].sort(lexicalSortI)).toStrictEqual(["a", "b", "C"])
      expect(["a", "B", "b"].sort(lexicalSortI)).toStrictEqual(["a", "B", "b"])
      expect(["a", "A", "a"].sort(lexicalSortI)).toStrictEqual(["a", "A", "a"])
    })

    it("case sensitive", () => {
      const lexicalSortC = sorting.lexicalSort(true, (val) => val)
      expect(["a", "b", "c"].sort(lexicalSortC)).toStrictEqual(["a", "b", "c"])
      expect(["a", "c", "a"].sort(lexicalSortC)).toStrictEqual(["a", "a", "c"])
      expect(["a", "c", "b"].sort(lexicalSortC)).toStrictEqual(["a", "b", "c"])
      expect(["a", "C", "b"].sort(lexicalSortC)).toStrictEqual(["a", "b", "C"])
      expect(["a", "B", "b"].sort(lexicalSortC)).toStrictEqual(["a", "b", "B"])
      expect(["a", "A", "a"].sort(lexicalSortC)).toStrictEqual(["a", "a", "A"])
    })

    it("numeric", () => {
      const numeric = sorting.numericSort((val) => val)
      expect([1, 2, 3].sort(numeric)).toStrictEqual([1, 2, 3])
      expect([1, 3, 2].sort(numeric)).toStrictEqual([1, 2, 3])
      expect([2, 2, 1].sort(numeric)).toStrictEqual([1, 2, 2])
      expect([3, 2, 1].sort(numeric)).toStrictEqual([1, 2, 3])
    })
  })
})
