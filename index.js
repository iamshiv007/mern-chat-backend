const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { createServer } = require("http")
const routes = require("./routes/router")

const app = express()
require("dotenv").config()

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

const { addUser, removeUser, getUser, getUsers, addUserToGroup, removeUserFromRoom, getUserFromgroup, getUsersFromGroup, } = require("./users")

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    socket.on("new-online-user", (userName, callback) => {
        const { error, user } = addUser(userName, socket.id)
        if (error) return callback(error)
        // reset online users list
        const onlineUsers = getUsers()
        console.log(onlineUsers, "after new online user")
        io.emit("get-online-users", onlineUsers);
        callback()
    });

    socket.on("send-message", (sender, receiver, message, callback) => {
        const user = getUser(receiver)
        console.log(user, message)
        io.to(user.socketId).emit("send-message", sender, message)
        callback()
    })

    // New user to group
    // socket.on("join-group", ({ userName, room }, callback) => {
    //     const { error, user } = addUserToGroup({ id: socket.id, userName, room })

    // if (error) return callback(error)

    // Emit will send message to the user
    // who had joined
    // socket.emit('welcome-message', {
    //     user: 'admin', text:
    //         `${user.name}, 
    //     welcome to room ${user.room}.`
    // });

    // Broadcast will send message to everyone
    // in the room except the joined user
    // socket.broadcast.to(user.room)
    //     .emit('user-joined-message', {
    //         user: "admin",
    //         text: `${user.name}, has joined`
    //     });

    // socket.join(user.room)

    // io.to(user.room).emit("group-data", {
    //     room: user.room,
    //     users: getUsersFromGroup(user.room)
    // })

    // callback()
    // });

    // Group message
    // socket.on("group-message", (message, callback) => {

    //     const user = getUserFromGroup(socket.id)
    //     io.to(user.room).emit("group-message", {
    //         user: user.name, text: message
    //     })

    //     callback()
    // })

    // socket.on("typing", (status, name, room) => {
    //     socket.broadcast.to(room)
    //         .emit('typing', status, name);
    // })

    socket.on("offline", () => {
        // remove user from online users list
        const user = removeUser(socket.id)
        // reset online users list
        const onlineUsers = getUsers()
        io.emit("get-online-users", onlineUsers);
    });

    socket.on("disconnect", () => {
        // remove user from online users list
        const user = removeUser(socket.id)
        const onlineUsers = getUsers()
        // reset online users list
        console.log(onlineUsers, "after disconnect")
        io.emit("get-online-users", onlineUsers);

        // check if user exist in any room 
        // if yes remove him
        // const user = removeUserFromGroup(socket.id)
        // if (user) {
        //     io.to(user.room).emit('message', {
        //         user: "Admin", text: `${user.name} had left`
        //     })
        // }
        console.log('🔥: A user disconnected')
    })
});

const connect = require("./database/connect")
connect()

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`)
})