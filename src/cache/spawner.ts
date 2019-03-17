import { profile } from "../profiler/decorator";
import { Spawner } from "../swarm/Spawner";

export class SpawnerCache {

	public static spawners: { [spawnerRoom: string]: Spawner } = {};

	@profile
	public static clear(): void {
		SpawnerCache.spawners = {};
	}

}
