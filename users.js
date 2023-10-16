const users = []
let onlineUsers = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === room && user.name === name
    )

    if (existingUser) {
        return { error: "Username is taken" }
    }


    const user = { id, name, room }


    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id
    )

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find(user => user.id === id)


const getUsersInRoom = (room) => users.filter((user) => user.room === room)

const getUser2 = (userName) => onlineUsers.find(user => user.userName === userName)

const removeUser2 = (socketId) => onlineUsers.filter((user) => user.socketId !== socketId)

const addUser2 = (userName, socketId) => {
    if (!onlineUsers.some((user) => user.userName === userName)) {  // if user is not added before
        onlineUsers.push({ userName, socketId })
    }
    return onlineUsers
}

module.exports = {
    addUser, removeUser, getUser, getUsersInRoom, getUser2, removeUser2, addUser2
}