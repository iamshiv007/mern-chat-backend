const asyncHandler = require("express-async-handler")

const sendToken = asyncHandler(async (user, status, message, res) => {
    const token = user.getJWTToken()

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: "None",
        secure: true
    }
    res.cookie("token", token, options)

    delete user._doc.password
    res.status(status).json({
        success: true,
        message,
        user: user._doc
    });
})

module.exports = sendToken