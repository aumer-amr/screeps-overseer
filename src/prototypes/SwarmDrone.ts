import { SwarmCreep } from "../memory/swarmCreep";
import { Task } from "../tasks/task";
import { deref } from "../utils/refs";
import { Task as ProtoTask } from "./task";

import { TaskHarvest, taskName as HarvestTaskName } from "../tasks/types/harvest";
import { moveToTargetType, TaskMoveTo, taskName as MoveToTaskName } from "../tasks/types/moveTo";
import { taskName as TransferTaskName, TaskTransfer, transferTargetType } from "../tasks/types/transfer";

export class SwarmDrone extends Creep {

	private _task: Task | null;

	public memory: SwarmCreep;

	get task(): Task | null {
		if (!this._task) {
			this._task = this.memory.task ? this.setTask(this.memory.task) : null;
		}
		return this._task;
	}

	set task(task: Task | null) {
		this.memory.task = task ? task : null;
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
		}

		newTask.proto = task;

		return newTask;
	}
}
