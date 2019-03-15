export interface HasPos {
	pos: RoomPosition;
}

export function hasPos(obj: HasPos | RoomPosition): obj is HasPos {
	try {
		return (obj as HasPos).pos !== undefined;
	} catch(e){
		return false;
	}
}
