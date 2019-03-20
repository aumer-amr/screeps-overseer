"use strict";

import { DronesCache } from "./cache/drones";
import { Overseer } from "./Overseer";
import Profiler from "./profiler/screeps-profiler";
import "./prototypes/Room";
import "./prototypes/RoomPosition";

let passedTicks = 0;
const reportAtTicks = 500;

const overseer = new Overseer();

function main(): void {
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log("Clearing non-existing creep memory:", name);
		}
	}

	if (++passedTicks > reportAtTicks) {
		Game.profiler.profile(reportAtTicks);
		passedTicks = 0;
	}

	DronesCache.clear();

	overseer.init();
	overseer.spawn();
	overseer.work();
}

export function loop(): void {
	Profiler.wrap(() => {
		main();
	});
}

Profiler.enable();
