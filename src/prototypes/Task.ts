import { TargetPos } from "./Target"

export interface Task {
    taskName: string;
	_targetRef: {
		ref: string;
		_pos: TargetPos;
	};
	_targetPos: RoomPosition;
	creep: Creep;
}