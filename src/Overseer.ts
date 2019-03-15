import { SwarmRoom } from "./memory/swarmRoom";
import { SpawnPriority } from "./priorities/spawn";
import { SwarmHost } from "./swarmhosts/swarmhost";

import { DronesCache } from "./cache/drones";

import { SwarmDrone } from "./prototypes/SwarmDrone";
import { BuilderHost } from "./swarmhosts/builderHost";
import { HarvesterHost } from "./swarmhosts/harvesterHost";
import { UpgraderHost } from "./swarmhosts/upgraderHost";

export class Overseer {

	private rooms: { [roomName: string]: Room };

	public init(): void {
		this.rooms = Game.rooms;

		Object.keys(Game.creeps).forEach((creepName: string) => {
			DronesCache.drones.push(Game.creeps[creepName] as SwarmDrone);
		});

	}

	/*public renewCreeps(): void {
		Object.keys(DronesCache.drones).forEach((creepName: string) => {
			const creep: Creep = DronesCache.drones[creepName];
			if (!creep.spawning && creep.ticksToLive) {
				const spawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
				if (creep.ticksToLive <= creep.room.findPath(creep.pos, spawn.pos).length) {
					if (creep.pos.inRangeTo(spawn, 1)) {
						spawn.renewCreep(creep);
					} else {
						creep.moveTo(spawn);
					}
				}
			}
		});
	}*/

	public spawn(): void {
		Object.keys(this.rooms).forEach((roomName: string) => {
			const room: Room = this.rooms[roomName];
			const memory = room.memory as SwarmRoom;

			if (typeof(memory.hosts) === "undefined") {
				memory.hosts = {};
			}

			(Object as any).values(SpawnPriority).forEach((priority: number) => {
				let host: SwarmHost | undefined;
				if (priority === SpawnPriority.HarvesterHost) {
					host = new HarvesterHost(room);
					//console.log("Creating HarvesterHost");
				}
				if (priority === SpawnPriority.UpgraderHost) {
					host = new UpgraderHost(room);
					//console.log("Creating UpgraderHost");
				}
				if (priority === SpawnPriority.BuilderHost) {
					host = new BuilderHost(room);
					//console.log("Creating BuilderHost");
				}

				//console.log("Creating creeps");
				if (typeof(host) !== undefined) {
					const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS);
					spawns.forEach((spawn: StructureSpawn) => {
						//console.log("Found spawn");
						if (host) {
							//console.log("Generating creep");
							host.generate(spawn.name);
						}
					});
				}

				//console.log("Run tasks");
				if (host) {
					host.task();
				}
			});

			room.memory = memory;
		});
	}

}
