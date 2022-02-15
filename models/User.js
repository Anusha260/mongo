const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true

    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String,

    },
    date: {
        type: Date,
        default: Date.new
    }
})
module.exports = User = mongoose.model('user', UserSchema)