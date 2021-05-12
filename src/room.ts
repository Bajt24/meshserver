import crypto from "crypto";
import { User } from "./user";
import { Connection } from "./connection";
import { RoomManager } from "./roomManager";

/**
 * if private then the room won't be shown in the list
 */
export enum RoomType {
    public,
    private
}

export class Room {
    name: string;
    key: string;
    created: number;
    private users: Map<string,User> = new Map();
    connections: Map<string, Connection> = new Map();
    type: RoomType = RoomType.public;

	constructor($name: string, $key: string, isPrivate: boolean) {
		this.name = $name;
        this.key = $key;
        this.created = Date.now();
        if (isPrivate)
            this.type = RoomType.private;
    }
    
    AddUser(user: User) {
        if (user.$room) {
            // we need to disconnect him from previous room
            user.$room.RemoveUser(user);
        }

        // we order user to create offers for other users
        this.users.forEach((target) => {
            let connectionKey = this.GenerateConnectionKey();
            this.connections.set(connectionKey, new Connection(connectionKey,user,target)); 
            user.GetAnswer(connectionKey, null);
        });
        this.users.set(user.$socket.id,user);
    }

    RemoveUser(user: User) {
        this.users.delete(user.$socket.id);
        user.$room = null;
        let rm = RoomManager.getInstance();

        // in case room is empty - remove it
        if (this.GetUserCount() == 0)
            rm.RemoveRoom(this.key);
    }

    GenerateConnectionKey(): string {
        let key = crypto.randomBytes(5).toString("hex");
        while (this.connections.hasOwnProperty(key))
            key = crypto.randomBytes(5).toString("hex");

        return key;
    }

    GetUserCount() {
        return this.users.size;
    }
}