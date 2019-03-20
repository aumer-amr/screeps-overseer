export function isEnergyStructure(obj: RoomObject): obj is EnergyStructure {
	return (obj as EnergyStructure).energy !== undefined && (obj as EnergyStructure).energyCapacity !== undefined;
}
