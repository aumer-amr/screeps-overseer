import { DronesCache } from "../cache/drones";
import { SwarmDrone } from "../swarm/SwarmDrone";
import { Tasks } from "../tasks/tasks";
import { transferTargetType } from "../tasks/types/transfer";
import nameGenerator from "../utils/nameGenerator";
import { SwarmHost } from "./swarmhost";

export class HarvesterHost extends SwarmHost {

	private maxCreeps: number = 3;
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

			if (creep.carry.energy < creep.carryCapacity) {
				const sources = creep.room.find(FIND_SOURCES);
				if (!creep.pos.inRangeTo(sources[0], 1)) {
					creep.task = Tasks.moveTo(sources[0].pos);
				} else {
					creep.task = Tasks.harvest(sources[0]);
				}
			} else {
				const targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType === STRUCTURE_EXTENSION ||
							structure.structureType === STRUCTURE_SPAWN ||
							structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
					}
				});
				if (targets.length > 0) {
					if (!creep.pos.inRangeTo(targets[0], 1)) {
						creep.task = Tasks.moveTo(targets[0].pos);
					} else {
						creep.task = Tasks.transfer(targets[0] as transferTargetType);
					}
				} else {
					const spawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
					creep.task = Tasks.moveTo(spawn.pos);
				}
			}
		});
	}

}
