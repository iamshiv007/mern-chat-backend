const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const { join } = require("path")
const { createServer } = require("http")
const routes = require("./routes/router")

const server = createServer(app)
const { Server } = require("socket.io")

const io = new Server(server, {
    cors: {
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL
    }
})

app.use(express.json())
app.use(cors())
app.use('/api', routes)


app.get("/", (req, res) => {
    res.send("Hello this is test message")
})

// app.get('/', (req, res) => {
//     res.sendFile(join(__dirname, 'index.html'));
// });

io.on('connection', (socket) => {
    console.log("A User Connected")
    // socket.on('chat message', (msg) => {
    //     console.log('message: ' + msg);
    // });
    // socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    // });

    socket.join("some room");

    io.to("some room").emit("some event");

    socket.on("foo", (value, callback) => {
        io.emit("foo", value),
            callback(
                { status: "Ok" }
            )
    })

    socket.on("disconnect", () => {
        console.log("A User Disconnected")
    })
});

const connect = require("./database/connect")
connect()

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})