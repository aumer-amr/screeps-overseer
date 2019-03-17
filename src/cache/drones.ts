import { profile } from "../profiler/decorator";
import { SwarmDrone } from "../swarm/SwarmDrone";

export class DronesCache {

	public static drones: { [droneName: string]: SwarmDrone };

	@profile
	public static clear(): void {
		DronesCache.drones = {};
	}

}
