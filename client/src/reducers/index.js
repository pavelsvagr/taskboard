import { combineReducers } from "redux"

import authReducer from "./authReducer"
import loadingReducer from "./loadingReducer"
import feedbackReducer from "./feedbackReducer"
import credentialsReducer from "./credentialsReducer"
import redirectReducer from "./redirectReducer"
import boardsReducer from "./boardsReducer"
import teamsReducer from "./teamsReducer"
import usersReducer from "./usersReducer"
import boardItemsReducer from "./boardItemsReducer"
import boardAssignmentsReducer from "./boardAssignmentsReducer"
import boardSettingsReducer from "./boardSettingsReducer"
import notificationsReducer from "./notificationsReducer"
import authErrorsReducer from "./authErrorsReducer"
import errorReducer from "./errorReducer"
import boardToolsReducer from "./boardToolsReducer"

export default combineReducers({
  auth: authReducer,
  authErrors: authErrorsReducer,
  errors: errorReducer,
  loading: loadingReducer,
  feedback: feedbackReducer,
  redirect: redirectReducer,

  users: usersReducer,

  credentials: credentialsReducer,

  boards: boardsReducer,
  boardItems: boardItemsReducer,
  boardAssignments: boardAssignmentsReducer,
  boardSettings: boardSettingsReducer,

  teams: teamsReducer,
  boardTools: boardToolsReducer,

  notifications: notificationsReducer,
})
