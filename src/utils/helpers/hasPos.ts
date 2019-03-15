interface HasPos {
    pos: RoomPosition
}

export function hasPos(obj: HasPos | RoomPosition): obj is HasPos {
	return (<HasPos>obj).pos != undefined;
}
