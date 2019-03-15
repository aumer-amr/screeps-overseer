RoomPosition.prototype.lookForStructure = function(structureType: StructureConstant): Structure | undefined {
	return _.find(this.lookFor(LOOK_STRUCTURES), (s) => s.structureType === structureType);
};
