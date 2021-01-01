import moment from "moment"

export default {
  auth: {
    _id: "test-user",
    email: "test@example.org",
    name: "Test",
    role: "user",
  },
  boards: {
    board: {
      _id: "test-smoke",
      credentials: "test-credentials",
      identifier: "test-smoke",
      name: "test-smoke",
      owner: "test-member",
      assignment: "projects",
      intervals: "weeks",
    },
    all: [
      {
        _id: "test-smoke",
        credentials: "test-credentials",
        identifier: "test-smoke",
        name: "test-smoke",
        owner: "test-member",
        assignment: "projects",
        intervals: "weeks",
      },
    ],
    members: [
      {
        _id: "test-member",
        nickname: "Test member",
        board: "test-smoke",
        order: 1,
        role: "member",
        user: {
          _id: "test-user",
          email: "test@example.org",
          name: "Test",
          role: "user",
        },
      },
      {
        _id: "test-member2",
        nickname: "Test member2",
        board: "test-smoke",
        order: 2,
        role: "member",
        user: { email: "test2@example.org", name: "Test", role: "user" },
      },
    ],
    teams: [],
  },
  boardItems: [
    {
      date: moment().format("YYYY-MM-DD"),
      member: "test-member",
      assignments: [
        {
          id: "test-a",
          title: "test-priority-1",
          url: "https://fit.cvut.cz",
        },
      ],
    },
  ],
  teams: {
    all: [
      {
        _id: "test-smoke-team",
        identifier: "test-smoke-team",
        name: "test-smoke-team",
        color: "white",
      },
      {
        _id: "test-smoke-team2",
        identifier: "test-smoke-team2",
        name: "test-smoke-team2",
        color: "blue",
      },
    ],
  },
  boardTools: {
    editMode: false,
    boardCopy: null,
    itemCopy: null,
    assignment: null,
  },
  credentials: {
    all: [],
  },
  boardAssignments: [],
}
