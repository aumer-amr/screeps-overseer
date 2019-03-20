interface Memory {
	roomPlanner: any;
}

interface Room {
	spawns: StructureSpawn[];
	my: boolean;
	constructionSites: ConstructionSite[];
}

interface Coord {
	x: number;
	y: number;
}

interface EnergyStructure extends Structure {
	energy: number;
	energyCapacity: number;
}

interface RoomObject {
	ref: string;
	targetedBy: string[];
}

interface ProtoRoomObject {
	ref: string;
	pos: TargetPos;
}

interface SpawnRequest {
	body: BodyPartConstant[];
	role: string;
	options?: SpawnRequestOptions;
}

interface SpawnRequestOptions {
	spawn?: StructureSpawn;
	directions?: DirectionConstant[];
}

interface StoreStructure extends Structure {
	store: StoreDefinition;
	storeCapacity: number;
}

interface TargetPos {
	x: number; 
	y: number; 
	roomName?: string; 
}

interface TargetType { 
	ref: string; 
	pos: TargetPos; 
}

interface ProtoTask {
	taskName: string;
	_targetRef: {
		ref: string;
		_pos: TargetPos;
	};
	_targetPos: RoomPosition;
	drone: { name: string };
}

