const express = require("express")
const connect = require("./database/connect")
const app = express()
require("dotenv").config()

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})

connect()

app.get("/", (req, res) => {
    res.send("Hello this is test message")
})