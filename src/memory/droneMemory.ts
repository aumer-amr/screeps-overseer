export interface DroneMemory extends CreepMemory {
	upgrading: boolean;
	role: string;
	memory: CreepMemory;
	building: boolean;
	targetPos: RoomPosition | undefined;
	task: ProtoTask | null;
	sourceId: string | undefined;
}
