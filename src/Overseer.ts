import { SpawnPriority } from "./priorities/spawn";
import { SwarmHost } from "./swarmhosts/swarmhost";

import { SpawnerCache } from "./cache/spawner";
import { RoomPlanner } from "./roomplanner/roomplanner";
import { Spawner } from "./swarm/Spawner";
import { SwarmDrone } from "./swarm/SwarmDrone";
import { HarvesterHost } from "./swarmhosts/harvesterHost";
import { UpgraderHost } from "./swarmhosts/upgraderHost";

export class Overseer {

	private rooms: { [roomName: string]: Room };
	private hosts: SwarmHost[] = [];
	private roomPlanners: { [roomName: string]: RoomPlanner } = {};

	public init(): void {
		this.rooms = Game.rooms;

		Object.keys(Game.creeps).forEach((creepName: string) => {
			const creep = new SwarmDrone(Game.creeps[creepName]);
		});
	}

	public spawn(): void {
		Object.keys(this.rooms).forEach((roomName: string) => {
			const room: Room = this.rooms[roomName];

			if (!this.roomPlanners[room.name]) {
				this.roomPlanners[room.name] = new RoomPlanner(room);
				this.roomPlanners[room.name].build();
			}

			if (!SpawnerCache.spawners[room.name]) {
				SpawnerCache.spawners[room.name] = new Spawner(room);
			}

			(Object as any).values(SpawnPriority).forEach((priority: number) => {
				let host: SwarmHost | undefined;
				if (priority === SpawnPriority.HarvesterHost) {
					host = new HarvesterHost(room);
				}
				if (priority === SpawnPriority.UpgraderHost) {
					host = new UpgraderHost(room);
				}

				if (host) {
					this.hosts.push(host);
					host.generate();
					host.task();
				}
			});

			SpawnerCache.spawners[room.name].run();
		});
	}

	public work(): void {
		this.hosts.forEach((host: SwarmHost) => {
			host.work();
		});
	}

}
