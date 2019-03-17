import { DronesCache } from "../cache/drones";
import { SwarmDrone } from "../swarm/SwarmDrone";

export abstract class SwarmHost {
	protected creeps: SwarmDrone[];
	public room: Room;
	public abstract creepRole: string;

	constructor(room: Room) {
		this.creeps = [];
		this.room = room;
	}

	public abstract isAllowedSpawn(): boolean;
	public abstract generate(): void;
	public abstract task(): void;

	public work(): void {
		for (const droneName in DronesCache.drones) {
			const drone: SwarmDrone = DronesCache.drones[droneName];
			if (drone.hasValidTask) {
				drone.run();
			}
		}
	}

}
