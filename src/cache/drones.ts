import { SwarmDrone } from "../swarm/SwarmDrone";

export class DronesCache {

	public static drones: { [droneName: string]: SwarmDrone };

	public static clear(): void {
		DronesCache.drones = {};
	}

}
