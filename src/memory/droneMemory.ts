import { Task } from "../tasks/task";

export interface DroneMemory extends CreepMemory {
	upgrading: boolean;
	role: string;
	memory: CreepMemory;
	building: boolean;
	targetPos: RoomPosition | undefined;
	task: Task | null;
}
