import { DronesCache } from "../cache/drones";
import { SwarmDrone } from "../swarm/SwarmDrone";
import { Tasks } from "../tasks/tasks";
import { withdrawTargetType } from "../tasks/types/withdraw";
import nameGenerator from "../utils/nameGenerator";
import { SwarmHost } from "./swarmhost";

export class UpgraderHost extends SwarmHost {

	private maxCreeps: number = 3;
	private defaultBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
	private creepRole: string = "upgrader";

	constructor(room: Room) {
		super(room);
		for (const droneName in DronesCache.drones) {
			const drone: SwarmDrone = DronesCache.drones[droneName];
			if (drone.memory.role === this.creepRole) { this.creeps.push(drone); }
		}
	}

	public isAllowedSpawn(): boolean {
		throw new Error("Method not implemented.");
	}

	public generate(spawn: string): void {
		if (this.creeps.length < this.maxCreeps) {
			if (Game.spawns[spawn].canCreateCreep(this.defaultBody) !== ERR_NOT_ENOUGH_ENERGY) {
				Game.spawns[spawn].createCreep(
					this.defaultBody,
					nameGenerator(this.creepRole),
					{ role: this.creepRole });
			}
		}
	}

	public task(): void {
		this.creeps.forEach((creep: SwarmDrone) => {
			if (creep.spawning === true && creep.ticksUntilSpawned === 0) { return; }

			this.upgrade(creep);
		});
	}

	private upgrade(creep: SwarmDrone): void {
		if (creep.memory.upgrading && creep.carry.energy === 0) {
			creep.memory.upgrading = false;
		}
		if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
			creep.memory.upgrading = true;
		}

		if (creep.memory.upgrading && creep.room.controller) {
			creep.task = Tasks.upgrade(creep.room.controller);
		} else if (creep.carry.energy < creep.carryCapacity) {
			const spawn = this.findWithdrawTarget(creep);
			if (spawn.length > 0) {
				const spawnStucture = spawn[0] as StructureSpawn;
				creep.task = Tasks.withdraw(spawnStucture);
			}
		}
	}

	private findWithdrawTarget(creep: SwarmDrone): AnyStructure[] {
		const targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType === STRUCTURE_SPAWN) && structure.energy > 0;
			}
		});
		return targets;
	}

}
