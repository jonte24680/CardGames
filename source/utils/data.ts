//const GlobalClasses = require("../Client/js/classes");

import {Room, Player, GameInfo, JoiningRoom, GameName} from "./classes";

var rooms: Room[] = [];

export function CreateRoom(roomID: number, hostID: string): Room {
    var RID: number = roomID;
    
    /*if (rooms == undefined) {
        rooms.push(new Room(RID, hostID));
        return rooms[rooms.length - 1]
    }*/

    while (RID == 0 || rooms.find(arr => arr.roomID == RID) != undefined) {
        RID = Math.floor(Math.random() * 1000000) + 1
    }

    var newRoom = new Room(RID, hostID)

    rooms.push(newRoom);
    rooms[rooms.length - 1].players = [];
    return rooms[rooms.length - 1]
}

export function JoinRoom(roomID: number, username: string | null, id: string): Room | null {
    var i: number = GetIndexRoomID(roomID);
    if (Number.isNaN(i) || username == null || username == "")
        return null;

    rooms[i].players.push(new Player(username, id));
    return rooms[i];
    
}

export function GetIndexRoomID(roomID: number): number{
    if (roomID == NaN) return NaN;
    for(var i = 0; i < rooms.length; i++){
        if (rooms[i].roomID == roomID)
            return i
    }
    return NaN;
}

export function GetRoom(roomID: number): Room | null {
    var RID = GetIndexRoomID(roomID)
    if (RID == NaN)
        return null;
    return rooms[RID];
}

export function StartNewGame(roomId: number, gameName: string): void | Error{
    const RID = GetIndexRoomID(roomId);
    if(isNaN(RID))
        return Error("No room found with id");
    return rooms[RID].StartNewGame(gameName);
}

export function PlayerAction(roomId: number,playerID: string , action: string, extra: any ){
    const RID = GetIndexRoomID(roomId);
    if(isNaN(RID))
        return Error("No room found with id");
    rooms[RID].PlayerAction(playerID, action, extra)
}
/*
module.exports = {
    CreateRoom, JoinRoom, GetIndexRoomID, GetRoom
}*/

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