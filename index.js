const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { createServer } = require("http")
const routes = require("./routes/router")
const socketSetup = require("./socket"); // Import the socket setup

const app = express()
require("dotenv").config()

const server = createServer(app)

app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(cookieParser())

app.use('/api', routes)

app.get("/", (req, res) => {
    res.send("Hello this is test message")
})

const connect = require("./database/connect")
connect()

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})

socketSetup(server)