import { SwarmRoom } from "./memory/swarmRoom";
import { SpawnPriority } from "./priorities/spawn";
import { SwarmHost } from "./swarmhosts/swarmhost";

import { SwarmDrone } from "./swarm/SwarmDrone";
import { HarvesterHost } from "./swarmhosts/harvesterHost";

export class Overseer {

	private rooms: { [roomName: string]: Room };
	private hosts: SwarmHost[] = [];

	public init(): void {
		this.rooms = Game.rooms;

		Object.keys(Game.creeps).forEach((creepName: string) => {
			new SwarmDrone(Game.creeps[creepName]);
		});

	}

	public spawn(): void {
		Object.keys(this.rooms).forEach((roomName: string) => {
			const room: Room = this.rooms[roomName];
			const memory = room.memory as SwarmRoom;

			(Object as any).values(SpawnPriority).forEach((priority: number) => {
				let host: SwarmHost | undefined;
				if (priority === SpawnPriority.HarvesterHost) {
					host = new HarvesterHost(room);
				}

				if (typeof(host) !== undefined) {
					const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS);
					spawns.forEach((spawn: StructureSpawn) => {
						if (host) {
							host.generate(spawn.name);
						}
					});
				}

				if (host) {
					host.task();
					this.hosts.push(host);
				}
			});

			room.memory = memory;
		});
	}

	public work(): void {
		this.hosts.forEach((host: SwarmHost) => {
			host.work();
		});
	}

}
