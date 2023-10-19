const express = require("express")
const router = express.Router()

const { sendMail } = require("../controllers/mail")
const { check } = require("express-validator")

const sendMailValidation = [
    check('name')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be at least 3 chars long'),
    check('email')
        .isEmail()
        .withMessage('Invalid email'),
    check('subject')
        .isLength({ min: 3, max:100 })
        .withMessage('Subject must be at least 3 chars long'),
    check('message')
        .isLength({ min: 4, max:2000 })
        .withMessage('Message must be at least 4 chars long'),
]

router.post("/mail/new", sendMailValidation, sendMail)

module.exports = router