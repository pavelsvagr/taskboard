module.exports = [
  {
    name: "Data types",
    tests: [
      {
        name: "Integer",
        data: {
          array: [1,2,3],
          oldIndex: 0,
          newIndex: 2,
          expected: [2,3,1]
        }
      },
      {
        name: "String",
        data: {
          array: ["a","b","c", "d"],
          oldIndex: 0,
          newIndex: 2,
          expected: ["b","c","a", "d"]
        }
      },
      {
        name: "bool",
        data: {
          array: [true,false,false,false],
          oldIndex: 0,
          newIndex: 3,
          expected: [false,false,false,true]
        }
      },
      {
        name: "object",
        data: {
          array: [{i:"a"}, {i:2},{c:"c"}, {a:()=> "|"}],
          oldIndex: 2,
          newIndex: 1,
          expected: [{c:"c"},{i:"a"}, {i:2}, {a:()=> "|"}]
        }
      },
      {
        name: "mixed",
        data: {
          array: ["a", {i:1},2, ()=>""],
          oldIndex: 0,
          newIndex: 1,
          expected: [{i:1},"a",2, ()=>""]
        }
      },
    ]
  },
  {
    name: "Move tests",
    tests: [
      {
        name: "Move 1",
        data: {
          array: [1,2],
          oldIndex: 0,
          newIndex: 1,
          expected: [2,1]
        }
      },
      {
        name: "Move 2",
        data: {
          array: [1,2,3],
          oldIndex: 0,
          newIndex: 1,
          expected: [2,1,3]
        }
      },
      {
        name: "Move 3",
        data: {
          array: [1,2,3],
          oldIndex: 1,
          newIndex: 0,
          expected: [2,1,3]
        }
      },
      {
        name: "Swap 1",
        data: {
          array: [1,2,3],
          oldIndex: 2,
          newIndex: 1,
          expected: [1,3,2]
        }
      },
      {
        name: "Swap 2",
        data: {
          array: [1,2,3,4],
          oldIndex: 1,
          newIndex: 2,
          expected: [1,3,2,4]
        }
      },
      {
        name: "Same indexes",
        data: {
          array: [1,2,3,4],
          oldIndex: 1,
          newIndex: 1,
          expected: [1,2,3,4]
        }
      },
      {
        name: "Long move 1",
        data: {
          array: [1,2,3,4,5,6,7,8,9,10,11,12,13],
          oldIndex: 11,
          newIndex: 0,
          expected: [12,1,2,3,4,5,6,7,8,9,10,11,13]
        }
      },
      {
        name: "Long move 2",
        data: {
          array: [1,2,3,4,5,6,7,8,9,10,11,12,13],
          oldIndex: 12,
          newIndex: 5,
          expected: [1,2,3,4,5,13,6,7,8,9,10,11,12]
        }
      },
    ]
  },
  {
    name: "Error tests",
    tests: [
      {
        name: "Error too big index",
        data: {
          array: [1,2],
          oldIndex: 0,
          newIndex: 2,
          error: true
        }
      },
      {
        name: "Error too low index",
        data: {
          array: [1,2,3],
          oldIndex: -1,
          newIndex: 0,
          error: true
        }
      }
    ]
  }
]