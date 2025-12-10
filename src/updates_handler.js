import * as github from "./github.js";

export class UpdatesHandler {
	constructor(sendUpdatesFunction, rerenderFunction) {
		this.sendUpdatesFunction = sendUpdatesFunction; // async
		this.rerenderFunction = rerenderFunction;
		this.newUpdates = new GroupOfUpdates();
		this.sendingUpdates = new GroupOfUpdates(true);
		this.timeoutId = undefined;
	}
	addUpdate(updateData, updateTable){
		this.newUpdates.updates.push([updateData, updateTable]);
		this.resetTimeout();
	}
	resetTimeout() {
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => { this.runGroupOfUpdates() }, 1000);
	}
	runGroupOfUpdates() {
		if (!this.sendingUpdates.resolved) {
			this.resetTimeout();
			return
		}
		this.sendingUpdates = this.newUpdates;
		this.newUpdates = new GroupOfUpdates();
		this.sendingUpdates.promise = this.sendUpdatesFunction(this.sendingUpdates.dataUpdates).then(() => {
			this.sendingUpdates.resolved = true;
			this.rerenderFunction(this.newUpdates.UIUpdates);
		})
	}
}

class GroupOfUpdates {
	constructor(resolved=false) {
		this.updates = []; // [updateData, updateTable], ...
		this.resolved = resolved;
	}
	get dataUpdates() {
		return this.updates.map(upds => upds[0]);
	}
	get UIUpdates() {
		return this.updates.map(upds => upds[1]);
	}
}
