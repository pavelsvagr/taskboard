import moment from "moment"

export default {
  auth: {
    _id: "test-user",
    email: "test@example.org",
    name: "Test",
    role: "admin",
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
    members: [
      {
        _id: "test-member",
        nickname: "Test member",
        board: "test-smoke",
        order: 1,
        role: "owner",
        user: {
          _id: "test-user",
          email: "test@example.org",
          name: "Test",
          role: "admin",
        },
      },
      {
        _id: "test-member2",
        nickname: "Test member2",
        board: "test-smoke2",
        order: 1,
        role: "member",
        user: {
          _id: "test-user2",
          email: "test2@example.org",
          name: "Test2",
          role: "user",
        },
      },
    ],
    teams: [
      {
        _id: "test-smoke-team",
        identifier: "test-smoke-team",
        name: "test-smoke-team",
        color: "white",
        members: ["test-member"],
      },
      {
        _id: "test-smoke-team2",
        identifier: "test-smoke-team2",
        name: "test-smoke-team2",
        color: "blue",
        members: [],
      },
    ],
    all: {
      data: [
        {
          _id: "test-smoke",
          credentials: "test-credentials",
          identifier: "test-smoke",
          name: "test-smoke",
          owner: "test-user",
          assignment: "projects",
          intervals: "weeks",
        }
      ],
      offset: 0,
      limit: 10,
      count: 1
    }
  },
  teams: {
    all: {
      data: [
        {
          _id: "test-smoke-team",
          identifier: "test-smoke-team",
          name: "test-smoke-team",
          color: "white",
        }
      ],
      offset: 0,
      limit: 10,
      count: 1
    }
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
  users: {
    data: [
      {
        _id: "test-user",
        email: "test@example.org",
        name: "Test",
        role: "admin",
      },
    ],
    offset: 0,
    limit: 10,
    count: 1
  },
  boardTools: {
    date: moment(),
    editMode: false,
    boardCopy: null,
    itemCopy: null,
    assignment: null,
    editMember: null,
    search: "",
  },
  credentials: {
    all: {
      data: [
        {
          _id: "test-credentials",
          url: "https://fit.cvut.cz",
          name: "test-credentials",
          type: "redmine",
          creator: "test-user",
        },
      ],
      offset: 0,
      limit: 10,
      count: 1
    },
  },
  boardAssignments: [],
}
