export interface SpawnRequest {
	body: BodyPartConstant[];
	role: string;
	options?: SpawnRequestOptions;
}

export interface SpawnRequestOptions {
	spawn?: StructureSpawn;
	directions?: DirectionConstant[];
}
