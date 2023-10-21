const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '2d'
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);