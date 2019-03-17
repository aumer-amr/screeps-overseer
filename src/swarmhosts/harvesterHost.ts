import { DronesCache } from "../cache/drones";
import { SpawnerCache } from "../cache/spawner";
import { EnergyStructure } from "../declarations/EnergyStructure";
import { SpawnRequest } from "../declarations/SpawnRequest";
import { SwarmDrone } from "../swarm/SwarmDrone";
import { Tasks } from "../tasks/tasks";
import { transferTargetType } from "../tasks/types/transfer";
import { SwarmHost } from "./swarmhost";

export class HarvesterHost extends SwarmHost {

	private maxCreeps: number = 5;
	private defaultBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
	private creepRole: string = "harvester";

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

			const targets = this.findTransferTarget(creep);
			if (targets.length > 0) {
				if (targets[0].structureType === STRUCTURE_SPAWN) {
					const spawn = (targets[0] as StructureSpawn);
					if (spawn.energy < spawn.energyCapacity && ((spawn.energyCapacity - spawn.energy) > creep.carry.energy)) {
						if (creep.memory.upgrading === true && creep.carry.energy > 0) {
							creep.memory.upgrading = false;
							return this.transfer(creep);
						}
						return this.harvest(creep);
					}
				}
			}

			if (creep.room.controller) {
				if (creep.room.controller.ticksToDowngrade <= (creep.room.controller.level >= 4 ? 10000 : 20000)) {
					return this.upgrade(creep);
				}
			}
		});
	}

	private transfer(creep: SwarmDrone): void {
		if (creep.carry.energy < creep.carryCapacity) {
			const spawn = creep.pos.lookForStructure(STRUCTURE_SPAWN) as EnergyStructure;
			if (spawn) {
				creep.task = Tasks.transfer(spawn);
			}
		}
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
			const source = creep.findAndAssignSource();
			if (source) {
				creep.task = Tasks.harvest(source);
			}
		}
	}

	private harvest(creep: SwarmDrone): void {
		if (creep.carry.energy < creep.carryCapacity) {
			const source = creep.findAndAssignSource();
			if (source) {
				creep.task = Tasks.harvest(source);
			}
		} else {
			const targets = this.findTransferTarget(creep);
			if (targets.length > 0) {
				creep.task = Tasks.transfer(targets[0] as transferTargetType);
			}
		}
	}

	private findTransferTarget(creep: SwarmDrone): AnyStructure[] {
		const targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType === STRUCTURE_EXTENSION ||
					structure.structureType === STRUCTURE_SPAWN ||
					structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
			}
		});
		return targets;
	}

}
