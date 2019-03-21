import _ from "lodash";
import { BuildPriorities } from "../priorities/build";
import { derefRoomPosition } from "../utils/refs";
import { basePlan } from "./plans/base";

export interface BuildingPlannerOutput {
	name: string;
	shard: string;
	rcl: string;
	buildings: { [structureType: string]: { pos: Coord[] } };
}

export interface StructureLayout {
	[rcl: number]: BuildingPlannerOutput | undefined;

	data: {
		anchor: Coord;
		pointsOfInterest?: {
			[pointLabel: string]: Coord;
		}
	};
}

export function getAllStructureCoordsFromLayout(layout: StructureLayout, rcl: number): Coord[] {
	if (!layout[rcl]) {
		return [];
	}

	const positionsByType = layout[rcl]!.buildings;
	let coords: Coord[] = [];

	for (const structureType in positionsByType) {
		coords = coords.concat(positionsByType[structureType].pos);
	}

	return _.uniqBy(coords, (coord: Coord) => coord.x + 50 * coord.y);
}

export function translatePositions(positions: RoomPosition[], fromAnchor: Coord, toAnchor: Coord) {
	const dx = toAnchor.x - fromAnchor.x;
	const dy = toAnchor.y - fromAnchor.y;
	const newPositions = [];

	for (const pos of positions) {
		newPositions.push(new RoomPosition(pos.x + dx, pos.y + dy, pos.roomName));
	}

	return newPositions;
}

export interface StructureMap {
	[structureType: string]: RoomPosition[];
}

export interface PlannerMemory {
	active: boolean;
	relocating?: boolean;
	recheckStructuresAt?: number;
	bunkerData?: {
		anchor: TargetPos
	};
	lastGenerated?: number;
	mapsByLevel: { [rcl: number]: { [structureType: string]: TargetPos[] } };
	savedFlags: Array<{ secondaryColor: ColorConstant, pos: TargetPos, memory: FlagMemory }>;
}

export interface RoomPlan {
	[componentName: string]: {
		map: StructureMap;
		pos: RoomPosition;
		rotation: number;
	}
}

export class RoomPlanner {

	private room: Room;
	private map: StructureMap;
	private memory: PlannerMemory = {
		active    : true,
		mapsByLevel: {},
		savedFlags: []
	}
	private placement: RoomPosition | undefined;
	private plan: RoomPlan;

	constructor(room: Room) {
		this.room = room;
		this.map = {};
		this.plan = {};
		this.refresh();
	}

	private refresh(){
		for (let rcl = 1; rcl <= 8; rcl++) {
			this.preBuild(rcl);
			this.memory.mapsByLevel[rcl] = this.map;
		}

		const placement = this.plannedStructurePositions(STRUCTURE_SPAWN);
		if (placement) {
			this.placement = placement[0];
		}
	}

	private preBuild(rcl: number): void {
		this.plan = this.generatePlan(rcl);
		this.map = this.mapFromPlan(this.plan);
	}

	public build(): void {
		this.refresh();
		if (this.room.constructionSites.length > 6) {
			return;
		}

		for (const structureType of BuildPriorities) {
			if (this.map[structureType]) {
				for (const pos of this.map[structureType]) {
					const result = pos.createConstructionSite(structureType);
					if (result !== OK) {
						console.log("Could not build", structureType, "at", pos.roomName, pos.x, pos.y);
					}
				}
			}
		}
	}

	private mapFromPlan(plan: RoomPlan): StructureMap {
		const map: StructureMap = {};
		const componentMaps: StructureMap[] = _.map(plan, (componentPlan) => componentPlan.map);
		const structureNames: string[] = _.uniq(_.flatten(_.map(componentMaps, (mapPlan) => _.keys(mapPlan))));
		for (const name of structureNames) {
			map[name] = _.compact(_.flatten(_.map(componentMaps, (mapPlan) => mapPlan[name])));
		}
		return map;
	}

	private generatePlan(level = 8): RoomPlan {
		const plan: RoomPlan = {};
		const layout = basePlan;
		if (layout) {
			const anchor: Coord = layout.data.anchor;
			const pos = this.placement;

			if (!pos) { return plan; }

			const componentMap = this.parseLayout(layout, level);
			this.translateComponent(componentMap, anchor, pos!);
			plan[name] = {
				map     : componentMap,
				pos     : new RoomPosition(anchor.x, anchor.y, this.room.name),
				rotation: 0
			};
		}
		return plan;
	}

	private translateComponent(map: StructureMap, fromPos: RoomPosition | Coord, toPos: RoomPosition | Coord): void {
		const dx = toPos.x - fromPos.x;
		const dy = toPos.y - fromPos.y;
		for (const structureType in map) {
			for (const pos of map[structureType]) {
				pos.x += dx;
				pos.y += dy;
			}
		}
	}

	private parseLayout(structureLayout: StructureLayout, level = 8): StructureMap {
		const map = {} as StructureMap;
		const layout = structureLayout[level];
		if (layout) {
			for (const buildingName in layout.buildings) {
				// tslint:disable-next-line: max-line-length
				map[buildingName] = _.map(layout.buildings[buildingName].pos, (pos) => new RoomPosition(pos.x, pos.y, this.room.name));
			}
		}
		return map;
	}

	private plannedStructurePositions(structureType: StructureConstant): RoomPosition[] | undefined {
		if (this.map[structureType]) {
			return this.map[structureType];
		}

		const roomMap = this.memory.mapsByLevel ? this.memory.mapsByLevel[8] : undefined;
		if (roomMap && roomMap[structureType]) {
			return _.map(roomMap[structureType], (targetPos) => derefRoomPosition(targetPos));
		}

		return;
	}

}
