import { User } from "./user";

/**
 * class representing connection between two clients
 */
export class Connection {
    private key: string;
    private user1: User;
    private user2: User;  


	constructor($key: string, $user1: User, $user2: User) {
		this.key = $key;
		this.user1 = $user1;
		this.user2 = $user2;
    }
    
    GetOtherUser(user: User) {
        if (user != this.user1)
            return this.user1;
        return this.user2;
    }

	public get $user1(): User {
		return this.user1;
	}

	public set $user1(value: User) {
		this.user1 = value;
	}

	public get $user2(): User {
		return this.user2;
	}

	public set $user2(value: User) {
		this.user2 = value;
	}
}