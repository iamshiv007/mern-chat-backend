const express = require("express")
const router = express.Router()
const { signup, login, logout, getUserDetails, getAllUsers } = require("../controllers/user")
const { isAuthenticatedUser } = require("../middleware/auth")
const User = require("../models/user")
const { check } = require("express-validator")

const signupValidation = [
    check('fullName')
        .isLength({ min: 3, max: 50 })
        .withMessage('Full Name must be at least 3 chars long'),
    check('gender')
        .isLength({ min: 4, max: 6 })
        .withMessage('Username must be at least 3 chars long'),
    check('userName')
        .isLength({ min: 6, max: 50 })
        .withMessage('Username must be at least 6 chars long')
        .custom(async (value) => {
            const usernameExist = await User.findOne({ userName: value })
            if (usernameExist) {
                throw new Error('Username already in use')
            }
            return true
        }),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long')
]

const loginValidation = [
    check('userName')
        .isLength({ min: 6, max: 50 })
        .withMessage('User Name must be at least 6 chars long'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long')
]

router.post("/user/signup", signupValidation, signup)
router.post("/user/login", loginValidation, login)

router.get("/user/logout", logout)
router.get("/user/me", isAuthenticatedUser, getUserDetails)
router.get("/user/all", isAuthenticatedUser, getAllUsers)

module.exports = router
