// pages/api/send-email.js
const nodemailer = require("nodemailer");
const Mail = require("../models/mail");

exports.sendMail = async (req, res) => {

    const { name, email, subject, message, receiverEmail } = req.body;

    // Replace these with your actual email service settings
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.FROM_EMAIL_ADDRESS,
            pass: process.env.FROM_EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.FROM_EMAIL_ADDRESS,
        to: receiverEmail,
        subject,
        html: `<html>
            <head>
              <style>
                /* Define your CSS styles here */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f2f2f2;
                }
                .email-content {
                  background-color: #ffffff;
                  border: 1px solid #ccc;
                  padding: 20px;
                  margin: 20px;
                }
                .email-header {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .info {
                  font-size: 14px;
                  margin-bottom: 10px;
                }
                .message {
                  font-size: 16px;
                }
              </style>
            </head>
            <body>
              <div class="email-content">
                <p class="email-header">New Email</p>
                <p class="info"><strong>Name:</strong> ${name}</p>
                <p class="info"><strong>Email:</strong> ${email}</p>
                <p class="info"><strong>Subject:</strong> ${subject}</p>
                <p class="email-header">Message:</p>
                <p class="message">${message}</p>
              </div>
            </body>
          </html>
          `
    };

    try {
        await transporter.sendMail(mailOptions);

        const mail = await Mail.create(req.body)

        res.status(200).json({ success: true, message: "Email sent successfully", mail });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "An error occurred while sending the email" });
    }
}