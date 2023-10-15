const User = require("../models/user")
const jwt = require("jsonwebtoken")

const isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ success: false, message: "User not authorized." })
    }

    const { userId } = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found." })
    } else {
        req.user = user
        next()
    }
}

module.exports = { isAuthenticatedUser }