const express = require("express")
const app = express()
const cors = require("cors")
const connect = require("./database/connect")
require("dotenv").config()

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})

connect()

const routes = require("./routes/router")
app.use('/api', routes)

app.get("/", (req, res) => {
    res.send("Hello this is test message")
})
