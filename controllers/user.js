// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const { validationResult } = require("express-validator")

const signup = asyncHandler(async (req, res, next) => {
    const { userName, email, password, interest } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    // password hashed
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ userName, email, password: hashedPassword, interest });

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: "None",
        secure: true
    }

    delete user._doc.password

    res.cookie("token", token, options).status(201).json({
        success: true,
        message: "User registered successfully.",
        user: user._doc
    });
})

const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const userExist = await User.findOne({ email })
    if (!userExist) {
        return res.status(400).json({ success: false, message: "User not exist." })
    }

    const isPasswordMatched = await bcrypt.compare(password, userExist.password)
    if (!isPasswordMatched) {
        return res.status(400).json({ success: false, message: "Password does not matched." })
    }

    const token = await jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: "None",
        secure: true
    }

    delete userExist._doc.password

    res.cookie("token", token, options).status(200).json({ sucess: true, message: "User logged in successfully.", user: userExist._doc })
})

const logout = async (req, res) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: false,
        sameSite: "None",
        secure: true
    }
    res.cookie("token", null, options).status(200).json({ success: true, message: "Logged out successfully." })
}

const getUserDetails = async (req, res) => {
    res.status(200).json({ success: true, message: "User details got successfully.", user: req.user })
}

module.exports = { signup, login, logout, getUserDetails }