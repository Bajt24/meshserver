import { User } from "./user";
import { RoomManager } from "./roomManager";
import { OfferData } from "./interfaces";
import { Server, Socket } from "socket.io";

/**
 * singleton class that handles socket connections and their requests
 */
export class SocketManager {
    private static instance: SocketManager;
    private io: Server;
  
    private constructor() {
    }
  
    static getInstance(): SocketManager {
        if (!SocketManager.instance) 
            SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }

    SetServer(server: Server) {
        this.io = server;
        let rm = RoomManager.getInstance();

        this.io.on("connection", (socket: Socket) => {
            let user = new User("test", socket);
            let rooms = rm.GetRooms();
            socket.emit("rooms", rooms);

            // user wants to create a new room
            socket.on("createRoom",(roomInfo, callback) => {
                if (user.$room)
                        user.$room.RemoveUser(user);
                let room = rm.AddRoom(roomInfo.roomName, (roomInfo.isPrivate == 'true'));
                console.log("roomCreated: "+roomInfo.roomName);
                let res = room.AddUser(user);
                user.$room = room;
                console.log("userJoined: " + roomInfo.roomName + ", socketid: " + user.$socket.id);
                //socket.emit("roomKey", room.key);
                callback(room.key);
            });

            // user wants to join a room
            socket.on("joinRoom", (roomKey: string, callback) => {
                try {
                    if (user.$room)
                        user.$room.RemoveUser(user);
                    let room = rm.GetRoomByKey(roomKey);
                    room.AddUser(user);
                    user.$room = room;
                    console.log("userJoined: " + room.name + ", socketid: " + user.$socket.id)
                    let roomInfo = {"created": room.created };
                    callback({success: true, room: roomInfo});
                } catch (e) {
                    callback({success: false});
                }
            });
            
            socket.on("disconnect", ()=>{
                let room = user.$room;
                if (room)
                    room.RemoveUser(user);
            });
            
            socket.on("leaveRoom", ()=>{
                let room = user.$room;
                if (room)
                    room.RemoveUser(user);
            });

            // user responded with new webrtc offer/answer
            socket.on("peer", (offer: OfferData)=>{
                try {
                    let conn = user.$room.connections.get(offer.id);
                    conn.GetOtherUser(user).GetAnswer(offer.id, offer.offer);
                } catch (e) {}
            });

            // user requested updated room info
            socket.on("rooms", ()=>{
                socket.emit("rooms",rm.GetRooms());
                
            });

            // sets the name of user, currently not used anywhere
            socket.on("setName", (name: string)=>{
                user.$name = name;
            });
        });
    }
}
