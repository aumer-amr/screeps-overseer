import { HasPos } from "../utils/helpers/hasPos";
import { SwarmDrone } from "./SwarmDrone";

export class DroneActions {

	private _creep: Creep;

	get creep(): Creep {
		return this._creep;
	}

	set creep(creep: Creep) {
		this._creep = creep;
	}

	public harvest(source: Source | Mineral) {
		const result = this._creep.harvest(source);
		return result;
	}

	// tslint:disable-next-line: max-line-length
	public transfer(target: Creep | SwarmDrone | Structure, resourceType: ResourceConstant = RESOURCE_ENERGY, amount?: number) {
		let result: ScreepsReturnCode;
		if (target instanceof SwarmDrone) {
			result = this.creep.transfer(target.creep, resourceType, amount);
		} else {
			result = this.creep.transfer(target, resourceType, amount);
		}
		return result;
	}

	public moveTo(destination: HasPos | RoomPosition, opts?: MoveToOpts): number {
		if (this.creep.spawning) {
			return -1;
		}

		return this.creep.moveTo(destination, opts);
	}

	public upgradeController(controller: StructureController) {
		const result = this.creep.upgradeController(controller);
		return result;
	}
}
