const mongoose = require("mongoose")
const config = require("config")
const db = config.get("mongoURI")

const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            userNewUrlParser: true,
            userCreaterIndex: true,
            useUnifiedTopology: true,
            userNewUrlParser: true,
            useFindAndModify: true

        })
        console.log("mongoDB connected.....")
    } catch (err) {
        console.error(err.message)
            //exit process with failure
        process.exit(1)
    }
}


module.exports = connectDB;