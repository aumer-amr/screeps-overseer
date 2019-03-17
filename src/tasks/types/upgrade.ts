import { Task } from "../task";

export type upgradeTargetType = StructureController;

export const taskName: string = "Upgrade";

export class TaskUpgrade  extends Task {

	private upgradeTarget: upgradeTargetType;

	constructor(target: upgradeTargetType) {
		super(taskName, {
			pos: target.pos,
			ref: target.id
		});
		this.upgradeTarget = target;
		this.moveToOpts = { range: 3 };
	}

	public isValidTask(): boolean {
		return this.drone.carry.energy > 0;
	}

	public isValidTarget(): boolean {
		return this.upgradeTarget !== undefined;
	}

	public work(): number {
		return this.drone.upgradeController(this.upgradeTarget);
	}

}
