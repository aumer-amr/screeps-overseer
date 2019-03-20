Object.defineProperty(Room.prototype, "my", {
	get() {
		return this.controller && this.controller.my;
	},
	configurable: true
});

Object.defineProperty(Room.prototype, "constructionSites", {
	get() {
		if (!this._constructionSites) {
			this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
		}
		return this._constructionSites;
	},
	configurable: true,
});
