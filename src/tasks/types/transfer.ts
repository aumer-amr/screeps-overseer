import { Task } from "../task";

export type transferTargetType = StructureStorage | StructureTerminal | StructureContainer;

export const taskName: string = "Transfer";

export class TaskTransfer extends Task {

	private transferTarget: transferTargetType;

	constructor(target: transferTargetType) {
		super(taskName, {
			pos: target.pos,
			ref: target.id
		});
		this.transferTarget = target;
	}

	public isValidTask(): boolean {
		const amount = this.drone.carry.energy || 0;
		if (amount > 0) {
			return true;
		}

		return false;
	}

	public isValidTarget(): boolean {
		return this.transferTarget.store.energy < this.transferTarget.storeCapacity;
	}

	public work(): number {
		const amount = this.drone.carry.energy || 0;
		if (amount > 0) {
			this.drone.transfer(this.transferTarget, RESOURCE_ENERGY);
		}

		return -1;
	}

}
