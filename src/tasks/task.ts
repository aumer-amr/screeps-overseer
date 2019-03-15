import { TargetPos, TargetType } from "../prototypes/Target";
import { deref, derefRoomPosition } from "../utils/refs";
import { Task as ProtoTask } from "../prototypes/task";

export abstract class Task {

	public taskName: string;
	public _targetRef: {
		ref: string;
		_pos: TargetPos;
	};
	public _targetPos: RoomPosition;
	public creep: Creep;

	constructor(taskName: string, target: TargetType) {
		this.taskName = taskName;

		if (target) {
			this._targetRef = {
				_pos: target.pos,
				ref: target.ref
			};
		} else {
			this._targetRef = {
				_pos: {
					roomName: "",
					x: -1,
					y: -1
				},
				ref: ""
			};
		}
	}

	public abstract isValidTask(): boolean;
	public abstract isValidTarget(): boolean;

	public isValid(): boolean {
		let validTask = false;
		if (this.creep) {
			validTask = this.isValidTask();
		}

		let validTarget = false;
		if (this.target) {
			validTarget = this.isValidTarget();
		}

		return validTask && validTarget;
	}

	private moveToTarget(range = 1): number {
		return this.creep.moveTo(this.targetPos, { range });
	}

	public abstract work(): number;

	get isWorking(): boolean {
		return this.creep.pos.inRangeTo(this.targetPos, 1);
	}

	get target(): RoomObject | null {
		return deref(this._targetRef.ref);
	}

	get targetPos(): RoomPosition {
		if (!this._targetPos) {
			if (this.target) {
				this._targetRef._pos = this.target.pos;
			}
			this._targetPos = derefRoomPosition(this._targetRef._pos);
		}
		return this._targetPos;
	}

	public run(): number | undefined {
		if (this.isWorking) {
			const result = this.work();
			return result;
		} else {
			return this.moveToTarget();
		}
	}

	get proto(): ProtoTask {
		return {
			taskName: this.taskName,
			creep : this.creep,
			_targetRef: this._targetRef,
			_targetPos: this._targetPos
		};
	}

	set proto(protoTask: ProtoTask) {
		this.creep = protoTask.creep;
		this._targetRef = protoTask._targetRef;
		this._targetPos = protoTask._targetPos;
	}
}
