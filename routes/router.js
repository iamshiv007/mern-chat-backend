const express = require("express")
const router = express.Router()

const mailRoutes = require('./mail')
router.use("/", mailRoutes)

const userRoutes = require('./user')
router.use("/", userRoutes)

module.exports = router