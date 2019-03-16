import { Task } from "../task";

export const taskName: string = "Harvest";

export class TaskHarvest extends Task {

	private harvestTarget: Source;
	public target: Source;

	constructor(target: Source) {
		super(taskName, {
			pos: target.pos,
			ref: target.id
		});
		this.harvestTarget = target;
	}

	public isValidTask(): boolean {
		return this.drone.carry.energy < this.drone.carryCapacity;
	}

	public isValidTarget(): boolean {
		return this.harvestTarget.energy > 0;
	}

	public work(): number {
		return this.drone.harvest(this.harvestTarget);
	}

}
