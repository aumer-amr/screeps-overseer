export interface EnergyStructure extends Structure {
	energy: number;
	energyCapacity: number;
}

export function isEnergyStructure(obj: RoomObject): obj is EnergyStructure {
	return (obj as EnergyStructure).energy !== undefined && (obj as EnergyStructure).energyCapacity !== undefined;
}
