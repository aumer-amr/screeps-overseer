export interface StoreStructure extends Structure {
	store: StoreDefinition;
	storeCapacity: number;
}

export function isStoreStructure(obj: RoomObject): obj is StoreStructure {
	return (obj as StoreStructure).store !== undefined && (obj as StoreStructure).storeCapacity !== undefined;
}
