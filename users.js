const users = []
let onlineUsers = [];

const addUser = (userName, socketId) => {
    const existingUser = onlineUsers.find(user => user.userName === userName)

    if (existingUser) {
        return { error: "Username is taken" }
    }

    const user = { userName, socketId }
    onlineUsers.push(user)

    return { user }
}

const removeUser = (socketId) => {
    const index = onlineUsers.findIndex(user => user.socketId === socketId)

    if (index !== -1) {
        return onlineUsers.splice(index, 1)[0]
    }
}

const getUser = (receiver) => onlineUsers.find(user => user.userName === receiver)

const getUsers = () => onlineUsers


const addUserToGroup = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find(user => user.room === room && user.name === name)

    if (existingUser) {
        return { error: "Username is taken" }
    }

    const user = { id, name, room }
    users.push(user)

    return { user }
}

const removeUserFromRoom = (id) => {
    const index = users.findIndex((user) => user.id === id
    )

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUserFromgroup = (id) => users.find(user => user.id === id)

const getUsersFromGroup = (room) => users.filter((user) => user.room === room)

module.exports = {
    getUser, removeUser, addUser, getUsers, addUserToGroup, removeUserFromRoom, getUserFromgroup, getUsersFromGroup
}