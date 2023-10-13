const express = require("express")
const router = express.Router()

const { signup } = require("../controllers/user")

router.route("/user/signup").post(signup)

module.exports = router