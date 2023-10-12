const express = require("express")
const router = express.Router()

const mailRoutes = require('./mail')
router.use("/", mailRoutes)

module.exports = router