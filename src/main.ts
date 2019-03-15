"use strict";

import { DronesCache } from "./cache/drones";
import { Overseer } from "./Overseer";
import { SwarmDrone } from "./prototypes/SwarmDrone";

const overseer = new Overseer();

function main(): void {
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log("Clearing non-existing creep memory:", name);
		}
	}

	overseer.init();
	overseer.spawn();
	//overseer.renewCreeps();

	DronesCache.drones.forEach((drone: SwarmDrone) => {
		if (drone.memory.role == "harvester") {
			console.log('Task', drone.hasValidTask);
		}
		if (drone.hasValidTask) {
			drone.run();
		}
	});
}

export function loop(): void {
	main();
}
