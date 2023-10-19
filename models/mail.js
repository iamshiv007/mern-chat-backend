const mongoose = require("mongoose")

const mailSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    email: {
        type: String,
        maxLength: 50,
        required: true
    },
    subject: {
        type: String,
        minLength: 3,
        maxLength: 100,
        required: true
    },
    message: {
        type: String,
        minLength: 3,
        maxLength: 2000,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("mail", mailSchema)