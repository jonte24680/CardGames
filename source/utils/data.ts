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
    const player = rooms[i].players.find(player => player.username == username)

    if(player != undefined){
        if (player.isOnline == false) {
            PlayerReconnect(id, player);
            return rooms[i];
        }
        return null;
    }

    if (Number.isNaN(i) || username == null || username == "")
        return null;

    rooms[i].players.push(new Player(username, id));
    return rooms[i];
}

export function PlayerReconnect(id: string, player: Player) {
    player.isOnline = true;
    player.id = id
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

export function ResetGame(roomId: number) {
    const RID = GetIndexRoomID(roomId);
    if(isNaN(RID))
        return Error("No room found with id");
    return rooms[RID].Reset();
}

export function PlayerAction(roomId: number, playerID: string, action: string, extra: any ){
    const RID = GetIndexRoomID(roomId);
    if(isNaN(RID))
        return Error("No room found with id");
    rooms[RID].PlayerAction(playerID, action, extra)
}

export function RoomDestory(roomID: number) {
    const RID = GetIndexRoomID(roomID);

    if(isNaN(RID))
        return

    return rooms.splice(RID)[0];
}

export function PlayerDisconect(roomID: number, playerID: string) {
    const RID = GetIndexRoomID(roomID);
    if(isNaN(RID))
        return Error("No room found with id");

    rooms[RID].players[rooms[RID].PlayerIndex(playerID)].isOnline = false;
}
/*
module.exports = {
    CreateRoom, JoinRoom, GetIndexRoomID, GetRoom
}*/