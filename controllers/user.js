// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const signup = asyncHandler(async (
    req,
    res
) => {
    const { userName, email, password, interest } = req.body;

    if (!userName || !email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Please fill all required fields" });
    }
        const userNameExist = await User.findOne({ userName })
        const emailExist = await User.findOne({ email })

        if (userNameExist) {
            return res.status(400).json({
                success: false,
                message: "User Name had already been used.",
            });
        }

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email address had already been used.",
            });
        }

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

        res.cookie("token", token, options).status(201).json({
            success: true,
            message: "User registered successfully.",
            user,
        });
})

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: true, message: "Please fill all required fields." })
    }

    const userExist = await User.findOne({ email })

    if (!userExist) {
        return res.status(400).json({ success: false, message: "User not exist." })
    }

    const isPasswordMatched = await bcrypt.compare(password, userExist.password)

    if (isPasswordMatched) {
        const token = await jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: false,
            sameSite: "None",
            secure: true
        }
        res.cookie("token", token, options).status(200).json({ sucess: true, message: "User logged in successfully.", user: userExist })
    } else {
        res.status(400).json({ success: false, message: "Password does not matched." })
    }
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