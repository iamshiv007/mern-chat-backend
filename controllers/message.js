// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Message = require("../models/message")
const asyncHandler = require("express-async-handler")

const newMessage = asyncHandler(async (req, res, next) => {

    const message = await Message.create(req.body);

    res.status(200).json({ success: true, message: "Message sent" })
})

module.exports = { newMessage }