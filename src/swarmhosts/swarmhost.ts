import { SwarmDrone } from "../prototypes/SwarmDrone";

export abstract class SwarmHost {
	protected creeps: SwarmDrone[];
	public room: Room;

	constructor(room: Room) {
		this.creeps = [];
		this.room = room;
	}

	public abstract isAllowedSpawn(): boolean;
	public abstract generate(spawn: string): void;
	public abstract task(): void;

}
