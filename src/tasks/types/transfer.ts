import { EnergyStructure, isEnergyStructure } from "../../declarations/EnergyStructure";
import { StoreStructure, isStoreStructure } from "../../declarations/StoreStructure";
import { Task } from "../task";

// tslint:disable-next-line: max-line-length
export type transferTargetType = EnergyStructure | StoreStructure;

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
		return amount > 0;
	}

	public isValidTarget(): boolean {
		const amount = this.drone.carry.energy || 0;
		if (isStoreStructure(this.transferTarget)) {
			return this.sum(this.transferTarget.store) <= this.transferTarget.storeCapacity - amount;
		} else if (isEnergyStructure(this.transferTarget)) {
			return this.transferTarget.energy <= this.transferTarget.energyCapacity - amount;
		}
		return false;
	}

	public work(): number {
		const amount = this.drone.carry.energy || 0;
		if (amount > 0) {
			this.drone.transfer(this.transferTarget, RESOURCE_ENERGY);
		}

		return -1;
	}

	private sum(store: StoreDefinition) {
		let amount = 0;
		for (const resourceType of this.keys(store)) {
			const capacity = store[resourceType];
			if (capacity) {
				amount += capacity;
			}
		}

		return amount;
	}

	private keys<T>(o: T): Array<keyof T> {
		return Object.keys(o) as Array<keyof T>;
	}

}
