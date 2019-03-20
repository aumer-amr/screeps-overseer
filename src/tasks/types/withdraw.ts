import { isEnergyStructure } from "../../declarations/EnergyStructure";
import { isStoreStructure } from "../../declarations/StoreStructure";
import { Task } from "../task";

export type withdrawTargetType = EnergyStructure | Tombstone;

export const taskName: string = "Withdraw";

export class TaskWithdraw extends Task {

	private withdrawalTarget: withdrawTargetType;
	private amount: number | undefined;

	constructor(target: withdrawTargetType, amount?: number | undefined) {
		super(taskName, {
			pos: target.pos,
			ref: target.id
		});
		this.withdrawalTarget = target;
		this.amount = amount;
	}

	public isValidTask(): boolean {
		const amount = this.amount || 1;
		return (this.drone.carry.energy <= this.drone.carryCapacity - amount);
	}

	public isValidTarget(): boolean {
		const amount = this.amount || 1;
		const target = this.withdrawalTarget;

		if (target instanceof Tombstone || isStoreStructure(target)) {
			return (target.store.energy || 0) >= amount;
		} else if (isEnergyStructure(target)) {
			return target.energy >= amount;
		}
		return false;
	}

	public work(): number {
		return this.drone.withdraw(this.withdrawalTarget, this.amount);
	}

}
