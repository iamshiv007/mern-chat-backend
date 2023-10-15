const express = require("express")
const router = express.Router()

const { signup, login, logout, getUserDetails } = require("../controllers/user")
const { isAuthenticatedUser } = require("../middleware/auth")

router.route("/user/signup").post(signup)
router.route("/user/login").post(login)
router.route("/user/logout").get(logout)
router.route("/user/me").get(isAuthenticatedUser, getUserDetails)

module.exports = router