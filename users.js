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

module.exports = {
    getUser, removeUser, addUser, getUsers
}