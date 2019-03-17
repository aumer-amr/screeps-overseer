import _ from "lodash";
import { SpawnRequest } from "../declarations/SpawnRequest";
import nameGenerator from "../utils/nameGenerator";

interface SpawnStructure extends StructureSpawn {
	ref: string;
}

export class Spawner {

	private spawns: StructureSpawn[];
	private availableSpawns: StructureSpawn[];
	private requests: SpawnRequest[] = [];
	private room: Room;

	constructor(room: Room) {
		this.room = room;
		this.refreshSpawns();
	}

	public queue(request: SpawnRequest) {
		this.requests.push(request);
	}

	public run(): number | undefined {
		let spawnResult: number | undefined;

		while (this.availableSpawns.length > 0) {
			const nextOrder = this.requests.shift();
			if (nextOrder) {
				spawnResult = this.spawnCreep(nextOrder);
			}

			if (spawnResult !== OK) {
				break;
			}
		}

		return spawnResult;
	}

	private spawnCreep(request: SpawnRequest): number | undefined {
		let spawnResult: number | undefined;
		const spawn = this.findAvailableSpawn();

		if (spawn && request.body.length > 0) {
			if (spawn.spawning) {
				return;
			}

			spawnResult = spawn.spawnCreep(
				request.body,
				nameGenerator(),
				{
					memory: {
						role: request.role
					}
				});

			if (spawnResult !== OK) {
				this.availableSpawns.unshift(spawn);
			}
		}
		return spawnResult;
	}

	private findAvailableSpawn(): StructureSpawn | undefined {
		return this.availableSpawns.shift();
	}

	private refreshSpawns(): void {
		const spawns = this.room.find(FIND_MY_SPAWNS);
		// tslint:disable-next-line: max-line-length
		this.spawns = _.sortBy(_.filter(spawns, (spawn) => spawn.my && spawn.isActive()), (spawn) => (spawn as SpawnStructure).ref);
		this.availableSpawns = _.filter(this.spawns, (spawn) => !spawn.spawning);
	}
}
