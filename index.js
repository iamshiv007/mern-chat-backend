const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const { createServer } = require("http")
const routes = require("./routes/router")
const cookieParser = require("cookie-parser")

const server = createServer(app)
const { Server } = require("socket.io")

const io = new Server(server, {
    cors: {
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL
    }
})

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

const { getUsersInRoom, removeUser, addUser, getUser, getUser2, removeUser2, addUser2 } = require("./users")

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    socket.on("new-user-add", (userName) => {
        const onlineUsers = addUser2(userName, socket.id)
        // send all active users to new user
        io.emit("get-users", onlineUsers);
    });

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

    // Group message
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

    socket.on("privateMessage", (sender, receiver, message, callback) => {
        const user = getUser2(receiver)
        io.to(user.socketId).emit("privateMessage", sender, message)
        callback()
    })

    socket.on("typing", (status, name, room) => {
        socket.broadcast.to(room)
            .emit('typing', status, name);
    })

    socket.on("offline", () => {
        // remove user from active users
        const onlineUsers = removeUser2(socket.id)
        // send all online users to all users
        io.emit("get-users", onlineUsers);
    });

    socket.on("disconnect", () => {
        // User remove from online list
        const onlineUsers = removeUser2(socket.id)
        console.log(onlineUsers)
        // reset all online users
        io.emit("get-users", onlineUsers);

        // check if user exist in any room 
        // if yes remove him
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', {
                user: "Admin", text: `${user.name} had left`
            })
        }
        console.log('🔥: A user disconnected')
    })
});

const connect = require("./database/connect")
connect()

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})