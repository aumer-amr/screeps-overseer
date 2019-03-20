import { DronesCache } from "../cache/drones";
import { SpawnerCache } from "../cache/spawner";
import { SwarmDrone } from "../swarm/SwarmDrone";
import { Tasks } from "../tasks/tasks";
import { SwarmHost } from "./swarmhost";

export class UpgraderHost extends SwarmHost {

	private maxCreeps: number = 5;
	private defaultBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
	public creepRole: string = "Upgrader";

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

	public generate(): void {
		if (this.creeps.length >= this.maxCreeps) {
			return;
		}

		const spawnRequest: SpawnRequest = {
			body: this.defaultBody,
			role: this.creepRole
		};
		SpawnerCache.spawners[this.room.name].queue(spawnRequest);
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
