Object.defineProperty(RoomObject.prototype, "ref", { // reference object; see globals.deref (which includes Creep)
	get() {
		return this.id || this.name || "";
	},
	configurable: true
});
