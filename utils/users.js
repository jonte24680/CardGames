const users = [];

// join usser to chat
function userJoin(id, username, room, money) {
    var user;
    if(users.find(user => user.username == username) == undefined){
        user = {id: id, username: username, room: room, money: money};
        users.push(user);
    } else {
        var index = users.findIndex(user => user.username === username)
        users[index].id = id;
        users[index].room = room;

        user = users[index];
    }

    return user;
}

// get current user
function getCurrentUser(id) {
    return users.find(user =>  user.id === id);
}

// user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};