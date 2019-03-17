import { TargetPos } from "./Target";

export interface RoomObject {
	ref: string;
	targetedBy: string[];
}

export interface ProtoRoomObject {
	ref: string;
	pos: TargetPos;
}
