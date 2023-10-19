const express = require("express")
const router = express.Router()
const { signup, login, logout, getUserDetails } = require("../controllers/user")
const { isAuthenticatedUser } = require("../middleware/auth")
const User = require("../models/user")
const { check } = require("express-validator")

const signupValidation = [
    check('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be at least 3 chars long')
        .custom(async (value) => {
            const usernameExist = await User.findOne({ userName: value })
            if (usernameExist) {
                throw new Error('Username already in use')
            }
            return true
        }),
    check('email')
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (value) => {
            const useremailExist = await User.findOne({ email: value })
            if (useremailExist) {
                throw new Error('E-mail already in use')
            }
            return true
        }),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 chars long')
]

const loginValidation = [
    check('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be at least 3 chars long'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 chars long')
]

router.post("/user/signup", signupValidation, signup)
router.post("/user/login", loginValidation, login)

router.get("/user/logout", logout)
router.get("/user/me", isAuthenticatedUser, getUserDetails)

module.exports = router
