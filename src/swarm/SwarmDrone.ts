import { DroneMemory } from "../memory/droneMemory";
import { Task } from "../tasks/task";
import { deref } from "../utils/refs";

import { DronesCache } from "../cache/drones";
import { SwarmHost } from "../swarmhosts/swarmhost";
import { TaskHarvest, taskName as HarvestTaskName } from "../tasks/types/harvest";
import { TaskInvalid } from "../tasks/types/invalid";
import { moveToTargetType, TaskMoveTo, taskName as MoveToTaskName } from "../tasks/types/moveTo";
import { taskName as TransferTaskName, TaskTransfer, transferTargetType } from "../tasks/types/transfer";
import { taskName as UpgradeTaskName, TaskUpgrade, upgradeTargetType } from "../tasks/types/upgrade";
import { taskName as WithdrawTaskName, TaskWithdraw, withdrawTargetType } from "../tasks/types/withdraw";
import { DroneActions } from "./DroneActions";

interface SourceDrones {
	[key: string]: number;
}

export class SwarmDrone extends DroneActions {

	public body: BodyPartDefinition[];
	public memory: DroneMemory;
	public carry: StoreDefinition;
	public carryCapacity: number;
	public id: string;
	public name: string;
	public pos: RoomPosition;
	public spawning: boolean;
	public room: Room;

	private _task: Task | null;

	constructor(creep: Creep) {
		super();
		this.creep = creep;
		this.body = creep.body;
		this.memory = creep.memory as DroneMemory;
		this.carry = creep.carry;
		this.carryCapacity = creep.carryCapacity;
		this.id = creep.id;
		this.name = creep.name;
		this.pos = creep.pos;
		this.spawning = creep.spawning;
		this.room = creep.room;

		DronesCache.drones[this.name] = this;
	}

	public refresh(): void {
		const creep = Game.creeps[this.name];
		if (creep) {
			this.creep = creep;
			this.pos = creep.pos;
			this.body = creep.body;
			this.carry = creep.carry;
			this.carryCapacity = creep.carryCapacity;
			this.memory = creep.memory as DroneMemory;
			this.room = creep.room;
			this._task = null;
		} else {
			delete DronesCache.drones[this.name];
		}
	}

	get isIdle(): boolean {
		return !this.task || !this.task.isValid();
	}

	get task(): Task | null {
		if (!this._task) {
			this._task = this.memory.task ? this.setTask(this.memory.task) : null;
		}
		return this._task;
	}

	set task(task: Task | null) {
		this.memory.task = task ? task.proto : null;
		if (task) {
			task.drone = this;
		}
		this._task = null;
	}

	get hasValidTask(): boolean {
		return !!this.task && this.task.isValid();
	}

	public run(): number | undefined {
		if (this.task) {
			return this.task.run();
		}
		return -1;
	}

	private setTask(task: ProtoTask): Task {
		const taskName = task.taskName;
		const taskTarget = deref(task._targetRef.ref);
		let newTask: any;

		if (taskName === HarvestTaskName) {
			newTask = new TaskHarvest(taskTarget as Source);
		} else if (taskName === MoveToTaskName) {
			newTask = new TaskMoveTo(taskTarget as moveToTargetType);
		} else if (taskName === TransferTaskName) {
			newTask = new TaskTransfer(taskTarget as transferTargetType);
		} else if (taskName === UpgradeTaskName) {
			newTask = new TaskUpgrade(taskTarget as upgradeTargetType);
		} else if (taskName === WithdrawTaskName) {
			newTask = new TaskWithdraw(taskTarget as withdrawTargetType);
		} else {
			newTask = new TaskInvalid();
		}

		newTask.proto = task;

		return newTask;
	}

	get ticksUntilSpawned(): number | undefined {
		if (this.spawning) {
			const spawner = this.pos.lookForStructure(STRUCTURE_SPAWN) as StructureSpawn;
			if (spawner && spawner.spawning) {
				return spawner.spawning.remainingTime;
			} else {
				throw new Error("Failed to get ticketsUntilSpawned for drone " + this.id);
			}
		}
		return 0;
	}

	public withdraw(target: Structure | Tombstone, amount?: number): number {
		const result = this.creep.withdraw(target, RESOURCE_ENERGY, amount);
		return result;
	}

	public findAndAssignSource(): Source | null {
		if (this.memory.sourceId) {
			return Game.getObjectById(this.memory.sourceId);
		}

		const assignedDronesPerSource: SourceDrones = {};
		for (const droneName in DronesCache.drones) {
			const drone: SwarmDrone = DronesCache.drones[droneName];

			if (drone.memory.sourceId) {
				if (!assignedDronesPerSource[drone.memory.sourceId]) {
					assignedDronesPerSource[drone.memory.sourceId] = 1;
					continue;
				}

				assignedDronesPerSource[drone.memory.sourceId]++;
			}
		}

		const sources = this.room.find(FIND_SOURCES);
		for (const sourceName in sources) {
			const possibleSource = sources[sourceName];
			if (!assignedDronesPerSource[possibleSource.id]) {
				assignedDronesPerSource[possibleSource.id] = 0;
			}

			if (assignedDronesPerSource[possibleSource.id] < 3) {
				this.memory.sourceId = possibleSource.id;
				return possibleSource;
			}
		}

		return null;
	}

	public reassign(swarmHost: SwarmHost) {
		this.memory.role = swarmHost.creepRole;
	}
}
