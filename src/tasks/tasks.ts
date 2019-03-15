import { TaskHarvest} from "./types/harvest";
import { moveToTargetType, TaskMoveTo } from "./types/moveTo";
import { TaskTransfer, transferTargetType } from "./types/transfer";

export class Tasks {

	public static moveTo(target: moveToTargetType): TaskMoveTo {
		return new TaskMoveTo(target);
	}

	public static transfer(target: transferTargetType): TaskTransfer {
		return new TaskTransfer(target);
	}

	public static harvest(target: Source): TaskHarvest {
		return new TaskHarvest(target);
	}

}
