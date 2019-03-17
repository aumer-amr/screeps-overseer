import { Task } from "../task";

export class TaskInvalid extends Task {

	constructor() {
		super("INVALID", {
			pos: {
				roomName: "",
				x: -1,
				y: -1
			},
			ref: ""
		});
	}

	public isValidTask(): boolean {
		return false;
	}

	public isValidTarget(): boolean {
		return false;
	}

	public work(): number {
		return OK;
	}
}
