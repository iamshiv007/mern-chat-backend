const { addUser, removeUser, getUser, getUsers } = require("./users")

module.exports = function (server) {
    const io = require("socket.io")(server, {
        cors: {
            "Access-Control-Allow-Origin": process.env.FRONTEND_URL
        }
    });

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

        console.log('🔥: A user disconnected')
    })
});
}