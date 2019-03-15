import { hasPos } from "../../utils/helpers/hasPos";
import { Task } from "../task";

export type moveToTargetType = { pos: RoomPosition } | RoomPosition;

export const taskName: string = "MoveTo";

export class TaskMoveTo extends Task {

	constructor(target: moveToTargetType) {
		if (hasPos(target)) {
			super(taskName, {
				pos: target.pos,
				ref: ""
			});
		} else {
			super(taskName, {
				pos: target,
				ref: ""
			});
		}
	}

	public isValidTask(): boolean {
		
		if (!this.drone.pos) throw new Error("EERRO!");
		return !this.drone.pos.inRangeTo(this.targetPos, 1);
	}

	public isValidTarget(): boolean {
		return true;
	}

	public work(): number {
		return OK;
	}
}
