var room = []
var RoomData = {
    roomID: 20,
    public: false,
    gameInfo: {
        type: "poker",
        currentPlayers: [
            {
                name: "joe",
                id: 20,
                money: 1000,
                bet: 10,
                totalBet: 20,
                cards: [
                    "2C",
                    "6D"
                ]
            }
        ]
    },
    allPlayers: [
        {
            name: "joe",
            id: 20,
            money: 1000,
        }
    ],
    cardDeck: ["2C", "4H", "7D", "5S"],
    hostID: 10
}

function CreateRoom(roomID, hostID){
    room.push({
        roomID: roomID,
        public: false,
        gameInfo: {
            type: null,
            currentPlayers: []
        },
        allPlayers: [],
        cardDeck: [],
        hostID: hostID
    });
}

function JoinRoom(roomID, name, id){
    var i = GetIndexRoomID(roomID);
    if (i = null)
        return null;
    room[i].allPlayers.push({name: name,
                            id: id, 
                            money: 10000});
    
}

function GetIndexRoomID(roomID){
    for(i = 0; i < room.length; i++){
        if (room[i].roomID == roomID)
            return i
    }
    return null
}

module.exports = {
    CreateRoom,
    JoinRoom,
    GetIndexRoomID
}