import { TargetPos } from "../declarations/Target";

export function derefRoomPosition(target: TargetPos): RoomPosition {
	return new RoomPosition(target.x, target.y, target.roomName || "");
}

export function deref(ref: string): RoomObject | null {
	return Game.getObjectById(ref) || Game.flags[ref] || Game.creeps[ref] || Game.spawns[ref] || null;
}
