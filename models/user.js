const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    interest: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);