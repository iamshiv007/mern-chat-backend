// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const User = require("../models/user")
const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const { validationResult } = require("express-validator")
const sendToken = require("../utils/jwtToken")

const signup = asyncHandler(async (req, res, next) => {
    const { userName, email, password, interest } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const user = await User.create({ userName, email, password, interest });

    sendToken(user, 201, "User registered successfully", res)
})

const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const userExist = await User.findOne({ email })
    if (!userExist) {
        return res.status(400).json({ success: false, message: "User not exist" })
    }

    const isPasswordMatched = await userExist.comparePassword(password)
    if (!isPasswordMatched) {
        return res.status(400).json({ success: false, message: "Password does not matched" })
    }

    sendToken(userExist, 200, "User logged in successfully", res)
})

const logout = async (req, res) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: false
    }
    res.cookie("token", null, options).status(200).json({ success: true, message: "Logged out successfully" })
}

const getUserDetails = async (req, res) => {
    res.status(200).json({ success: true, message: "User details got successfully", user: req.user })
}

module.exports = { signup, login, logout, getUserDetails }