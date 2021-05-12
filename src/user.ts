import { Socket } from "socket.io";
import { OfferData} from "./interfaces";
import { Room } from "./room";

export class User {
    private name: string;
    private socket: Socket;
    private room: Room = null;

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}
    /**
     * Getter $room
     * @return {Room}
     */
	public get $room(): Room {
		return this.room;
	}

    /**
     * Setter $room
     * @param {Room} value
     */
	public set $room(value: Room) {
		this.room = value;
	}

	constructor($name: string, $socket: Socket) {
		this.name = $name;
		this.socket = $socket;
	}

    GetAnswer(key: string, offer: string) {
        let offerData = new OfferData(key, offer);
        this.socket.emit("peer",offerData);
    }

    /**
     * Getter $socket
     * @return {Socket}
     */
	public get $socket(): Socket {
		return this.socket;
	}

    /**
     * Setter $socket
     * @param {Socket} value
     */
	public set $socket(value: Socket) {
		this.socket = value;
	}
}