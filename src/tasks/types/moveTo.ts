import { hasPos } from "../../utils/helpers/hasPos";
import { Task } from "../task";

export type moveToTargetType = { pos: RoomPosition } | RoomPosition;

export const taskName: string = "MoveTo";

export class TaskMoveTo extends Task {

	constructor(target: moveToTargetType, opts?: MoveToOpts) {
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

		this.moveToOpts = opts;
	}

	public isValidTask(): boolean {
		const range = this.moveToOpts && this.moveToOpts.range ? this.moveToOpts.range : 1;
		return !this.drone.pos.inRangeTo(this.targetPos, range);
	}

	public isValidTarget(): boolean {
		return true;
	}

	public work(): number {
		return OK;
	}
}
