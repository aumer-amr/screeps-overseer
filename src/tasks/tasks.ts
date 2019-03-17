import { TaskHarvest} from "./types/harvest";
import { moveToTargetType, TaskMoveTo } from "./types/moveTo";
import { TaskTransfer, transferTargetType } from "./types/transfer";
import { TaskUpgrade, upgradeTargetType } from "./types/upgrade";

export class Tasks {

	public static moveTo(target: moveToTargetType, opts?: MoveToOpts): TaskMoveTo {
		return new TaskMoveTo(target, opts);
	}

	public static transfer(target: transferTargetType): TaskTransfer {
		return new TaskTransfer(target);
	}

	public static harvest(target: Source): TaskHarvest {
		return new TaskHarvest(target);
	}

	public static upgrade(target: upgradeTargetType): TaskUpgrade {
		return new TaskUpgrade(target);
	}

}
