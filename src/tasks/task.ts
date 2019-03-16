import { DronesCache } from "../cache/drones";
import { TargetPos, TargetType } from "../prototypes/Target";
import { Task as ProtoTask } from "../prototypes/task";
import { SwarmDrone } from "../swarm/SwarmDrone";
import { deref, derefRoomPosition } from "../utils/refs";

export abstract class Task {

	public taskName: string;
	public _targetRef: {
		ref: string;
		_pos: TargetPos;
	};
	public _targetPos: RoomPosition;
	public _drone: { name: string };

	constructor(taskName: string, target: TargetType) {
		this.taskName = taskName;

		this._drone = { name: "" };

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
		if (this.drone) {
			validTask = this.isValidTask();
		}

		let validTarget = false;
		if (this.target || this.targetPos) {
			validTarget = this.isValidTarget();
		}

		return validTask && validTarget;
	}

	private moveToTarget(): number {
		return this.drone.moveTo(this.targetPos);
	}

	public abstract work(): number;

	get isWorking(): boolean {
		return this.drone.pos.inRangeTo(this.targetPos, 1);
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
			_targetPos: this._targetPos,
			_targetRef: this._targetRef,
			drone : this.drone,
			taskName: this.taskName
		};
	}

	set proto(protoTask: ProtoTask) {
		this.drone = protoTask.drone;
		this._targetRef = protoTask._targetRef;
		this._targetPos = protoTask._targetPos;
	}

	get drone(): SwarmDrone {
		return DronesCache.drones[this._drone.name];
	}

	set drone(drone: SwarmDrone) {
		this._drone.name = drone.name;
	}
}
