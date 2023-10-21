const Message = require("../models/message")
const asyncHandler = require("express-async-handler")

const newMessage = asyncHandler(async (req, res, next) => {

    const message = await Message.create(req.body);

    res.status(200).json({ success: true, message: "Message sent" })
})

const getTwoChat = asyncHandler(async (req, res) => {
    const { sender, receiver } = req.body
    const messages = await Message.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    })

    res.status(200).json({ success: true, messages })
})

module.exports = { newMessage, getTwoChat }