export class OfferData {
    offer: string;
    id: string;

	constructor($id: string, $offer: string = null) {
        this.id = $id;
		this.offer = $offer;
	}
}

export class RoomListData {
    key: string;
    name: string;
    userCount: number;

    constructor(key:string, name: string, userCount: number) {
        this.key = key;
        this.name = name;
        this.userCount = userCount;
    }
}