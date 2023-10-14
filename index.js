const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
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

const { getUsersInRoom, removeUser, addUser, getUser } = require("./users")

io.on('connection', (socket) => {
    console.log("A User Connected")

    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        // Emit will send message to the user
        // who had joined
        socket.emit('message', {
            user: 'admin', text:
                `${user.name}, 
            welcome to room ${user.room}.`
        });

        // Broadcast will send message to everyone
        // in the room except the joined user
        socket.broadcast.to(user.room)
            .emit('message', {
                user: "admin",
                text: `${user.name}, has joined`
            });

        socket.join(user.room)

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    });

    socket.on("sendMessage", (message, callback) => {

        const user = getUser(socket.id)
        io.to(user.room).emit("message", {
            user: user.name, text: message
        })

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', {
                user: "Admin", text: `${user.name} had left`
            })
        }
        console.log("A User Disconnected")
    })
});

const connect = require("./database/connect")
connect()

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})