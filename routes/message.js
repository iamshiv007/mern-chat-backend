const express = require("express")
const router = express.Router()
const { isAuthenticatedUser } = require("../middleware/auth")
const { newMessage, getTwoChat, getAllChat } = require("../controllers/message")

router.post("/message/new", isAuthenticatedUser, newMessage)
router.post("/message/two", isAuthenticatedUser, getTwoChat)
router.get("/message/all/:sender", isAuthenticatedUser, getAllChat)

module.exports = router
