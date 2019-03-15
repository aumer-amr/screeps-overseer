import { SwarmCreep } from "../memory/swarmCreep";
import nameGenerator from "../utils/nameGenerator";
import { SwarmHost } from "./swarmhost";

export class UpgraderHost extends SwarmHost {

	private maxCreeps: number = 4;
	private defaultBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
	private creepRole: string = "upgrader";
	private creepss: any[] = [];

	constructor(room: Room) {
		super(room);
		const creeps = Game.creeps;
		Object.keys(creeps).forEach((creepName: string) => {
			const creep: Creep = Game.creeps[creepName];
			const memory = creep.memory as SwarmCreep;
			if (memory.role === this.creepRole) { this.creepss.push(creep); }
		});
	}

	public isAllowedSpawn(): boolean {
		throw new Error("Method not implemented.");
	}

	public generate(spawn: string): void {
		if (this.creeps.length < this.maxCreeps) {
			if (Game.spawns[spawn].canCreateCreep(this.defaultBody) !== ERR_NOT_ENOUGH_ENERGY) {
				this.creepss.push(Game.spawns[spawn].createCreep(
					this.defaultBody,
					nameGenerator(this.creepRole),
					{ role: this.creepRole }));
			}
		}
	}

	public task(): void {
		this.creepss.forEach((creep: Creep) => {
			if (creep.spawning === true) { return; }

			const memory = creep.memory as SwarmCreep;

			if(memory.upgrading && creep.carry.energy === 0) {
				memory.upgrading = false;
				creep.say("🔄 harvest");
			}
			if(!memory.upgrading && creep.carry.energy === creep.carryCapacity) {
				memory.upgrading = true;
				creep.say("⚡ upgrade");
			}

			if (memory.upgrading && creep.room.controller) {
				if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: "#ffffff"}});
				}
			} else {
				const sources = creep.room.find(FIND_SOURCES);
				if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
				}
			}

			creep.memory = memory;
		})
	}

}
