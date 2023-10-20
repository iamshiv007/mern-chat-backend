const express = require("express")
const router = express.Router()
const getIpInfo = require("../controllers/ipApi")

router.get("/ip/api", getIpInfo)

module.exports = router