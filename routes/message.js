const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middleware/auth")
const { newMessage } = require("../controllers/message")

router.post("/message/new", isAuthenticatedUser, newMessage)

module.exports = router
