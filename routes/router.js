const express = require("express")
const router = express.Router()

const mailRoutes = require('./mail')
router.use("/", mailRoutes)

const userRoutes = require('./user')
router.use("/", userRoutes)

const messageRoute = require('./message')
router.use("/", messageRoute)

const ipApiRoute = require('./ipApi')
router.use("/", ipApiRoute)

module.exports = router