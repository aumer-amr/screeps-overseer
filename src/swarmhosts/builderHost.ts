import { SwarmCreep } from "../memory/swarmCreep";
import nameGenerator from "../utils/nameGenerator";
import { SwarmHost } from "./swarmhost";

export class BuilderHost extends SwarmHost {

	private maxCreeps: number = 2;
	private defaultBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
	private creepRole: string = "builder";

	constructor(room: Room) {
		super(room);
		const creeps = Game.creeps;
		Object.keys(creeps).forEach((creepName: string) => {
			const creep: Creep = Game.creeps[creepName];
			const memory = creep.memory as SwarmCreep;
			//if (memory.role === this.creepRole) { this.creeps.push(creep); }
		});
	}

	public isAllowedSpawn(): boolean {
		const controller: StructureController | undefined = this.room.controller;
		if (controller) {
			return controller.level >= 3;
		} else {
			return false;
		}
	}

	public generate(spawn: string): void {
		if (this.creeps.length < this.maxCreeps && this.isAllowedSpawn()) {
			if (Game.spawns[spawn].canCreateCreep(this.defaultBody) !== ERR_NOT_ENOUGH_ENERGY) {
				/*this.creeps.push(Game.spawns[spawn].createCreep(
					this.defaultBody,
					nameGenerator(this.creepRole),
					{ role: this.creepRole }));*/
			}
		}
	}

	public task(): void {
		this.creeps.forEach((creep: Creep) => {
			if (creep.spawning === true) { return; }

			const memory = creep.memory as SwarmCreep;
			if (memory.building && creep.carry.energy === 0) {
				memory.building = false;
				creep.say("🔄 harvest");
			}
			if (!memory.building && creep.carry.energy === creep.carryCapacity) {
				memory.building = true;
				creep.say("🚧 build");
			}

			if (memory.building) {
				const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length) {
					if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#ffffff"}});
					}
				}
			} else {
				const sources = creep.room.find(FIND_SOURCES);
				if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
				}
			}
		});
	}

}
