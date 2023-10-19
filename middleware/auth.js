const asyncHandler = require("express-async-handler")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ success: false, message: "Please login to access this resource" })
    }

    const { id } = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(id)
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found" })
    }

    delete user._doc.password
    req.user = user._doc
    next()

})
module.exports = { isAuthenticatedUser }