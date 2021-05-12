import { Room, RoomType } from "./room";
import crypto from "crypto";
import { RoomListData } from "./interfaces";

/**
 * singleton class that handles room operations
 */
export class RoomManager {
    private static instance: RoomManager;
    rooms: Map<string, Room> = new Map();
  
    private constructor() {
    }
  
    static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    /**
     * creates room with given params and assigns a unique key to it
     * @param name room name
     * @param isPrivate is private
     */
    AddRoom(name: string, isPrivate: boolean): Room {
        let key = crypto.randomBytes(2).toString("hex");
        while (this.rooms.get(key) != undefined)
            key = crypto.randomBytes(2).toString("hex");
        
        let r = new Room(name,key,isPrivate);
        this.rooms.set(key,r);
        return r;
    }

    GetRoomByKey(key: string): Room {
        let r = this.rooms.get(key);
        if (r == undefined)
            throw new RangeError();
        return r;
    }

    /**
     * removes the room from list
     * @param key roomkey
     */
    RemoveRoom(key: string) {
        return this.rooms.delete(key);
    }
 
    /**
     * gets the list of rooms needed for clients
     */
    GetRooms() {
        let arr: RoomListData[] = [];
        this.rooms.forEach((r: Room)=>{
            if (r.type == RoomType.public)
                arr.push({key: r.key, name: r.name, userCount: r.GetUserCount()})      
        })
        return arr;
    }
    
}