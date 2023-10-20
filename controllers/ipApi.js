const { default: axios } = require("axios");
const asyncHandler = require("express-async-handler")

const getIpInfo = asyncHandler(async (req, res, next) => {
    const { data } = await axios.get("https://ipapi.co/json/")

    res.status(200).json({ success: true, info: data })
})

module.exports = getIpInfo