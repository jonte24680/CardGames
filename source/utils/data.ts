import socketIO, { Socket } from "socket.io";
import {Room, Player, GameInfo, JoiningRoom} from "./classes";

var rooms: Room[] = [];

export function CreateRoom(roomID: number, hostID: string, io: socketIO.Server): Room {
    var RID: number = roomID;

    while (RID == 0 || rooms.find(arr => arr.roomID == RID) != undefined) {
        RID = Math.floor(Math.random() * 1000000) + 1
    }

    var newRoom = new Room(RID, hostID, io)

    rooms.push(newRoom);
    rooms[rooms.length - 1].allPlayers = [];
    return rooms[rooms.length - 1]
}

export function JoinRoom(roomID: number, username: string | null, id: string): Room | null{
    var i: number = GetIndexRoomID(roomID);
    if (i == NaN || username == null || username == "")
        return null;

    rooms[i].allPlayers.push(new Player(username, id));
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