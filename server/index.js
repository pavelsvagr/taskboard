const express = require("express")
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const passport = require("passport")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const moment = require("moment")
const keys = require("./config/keys")
const { PORT_DEFAULT, COOKIE_MAX_AGE } = require("../shared/constants/http")

const handleErrors = require("./app/middlewares/errors/handleErrors")
const logErrors = require("./app/middlewares/errors/logErrors")

// Models
require("./app/model/models/User")
require("./app/model/models/Credentials")
require("./app/model/models/Team")
require("./app/model/models/Board")
require("./app/model/models/Member")
require("./app/model/models/BoardItem")
require("./app/model/models/BoardTeam")
require("./app/model/models/Notification")
require("./app/model/models/Logs")

// Auth initialization
require("./app/services/passport")

moment.updateLocale("en", { week: { dow: 1 } })

// Db
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

// App
const app = express()

app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: COOKIE_MAX_AGE,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize(null))
app.use(passport.session(null))
app.use(express.json())
app.use(cors())

app.use(express.static(path.resolve(__dirname, "../client/build")))
app.use(express.static(path.resolve(__dirname, "../client/static")))

// Routing
require("./app/routes/authRoutes")(app)
require("./app/routes/usersRoutes")(app)
require("./app/routes/credentialsRoutes")(app)
require("./app/routes/boardRoutes")(app)
require("./app/routes/teamsRoutes")(app)
require("./app/routes/notificationsRoutes")(app)

// Custom error loggers
app.use(logErrors)
app.use(handleErrors)

if (process.env.NODE_ENV === "production") {
  // Other routes - Return client index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

const PORT = process.env.PORT || PORT_DEFAULT
app.listen(PORT)


module.exports = app