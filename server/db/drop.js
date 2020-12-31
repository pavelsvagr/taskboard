const mongoose = require("mongoose")
const keys = require("../config/keys")

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    mongoose.connection.db.dropDatabase((err) => {
        if (err) {
            console.error(err.message)
        } else {
            console.log("Collections truncated.")
        }
        mongoose.connection.close()
    })
})
