/// <reference path="util.ts" />

module robotcode {
	export interface GridValue {
		colors: any;
		grid: string[];
	}

	export class Cell {
		public color:string;
	};

	export class Grid {
		cells:Cell[][];
		width:number;
		height:number;
	};

	export class Robot {
		x = 0;
		y = 0;
		angle = 0;
	};

	export class World {
		constructor(public robot:Robot, public grid:Grid){}
	};

	export class Action {
		constructor(public name:string, public description:string, public container = false){}
	};

	export class ActionInstance {
		executing:boolean = false;
		parent:ActionContainer;
		container:ActionContainer;
		constructor(public action:Action){}
	};

	export class ActionContainer {
		parent:ActionInstance;
		actions:ActionInstance[] = [];
	};

	export class Control {
		playing:boolean;
	};

	export class AvailableActions {
		constructor(public actions:Action[]){}
	};	

	export var mapActions:{[key:string]:(world:robotcode.World, callback:()=>void)=>void} = {};

	export function createGrid(gridValue:GridValue):Grid {
		var grid = new Grid();
		grid.width = gridValue.grid[0].length;
		grid.height = gridValue.grid.length;

		var cells:Cell[][] = [];
		for (var i = 0; i < grid.width; ++i) {
			cells[i] = [];
			for (var j = 0; j < grid.height; ++j) {
				var cell = new Cell();
				cell.color = gridValue.colors[gridValue.grid[j][i]];
				cells[i][j] = cell;
			}
		}		
		grid.cells = cells;
		return grid;
	}

	function createActionInstance(action:Action) {
		var actionInstance = new ActionInstance(action);
		if (action.container) {
			actionInstance.container = new ActionContainer();
			actionInstance.container.parent = actionInstance;
		}
		return actionInstance;
	}

	export class Script {
		currentIndex:number = 0;
		currentActionInstance:ActionInstance;
		isPaused:boolean = true;
		control:Control;
		scriptContainer:ActionContainer = new ActionContainer();
		constructor(public world:World) {
			this.control = new Control();
		}
		add(action:Action) {
			var actionInstance = createActionInstance(action);
			actionInstance.parent = this.scriptContainer;
			this.scriptContainer.actions.push(actionInstance);
			return this;
		}
		move(action:ActionInstance, newIndex:number) {
			var lastIndex = this.scriptContainer.actions.indexOf(action);
			this.scriptContainer.actions.splice(lastIndex, 1);
			this.scriptContainer.actions.splice(newIndex, 0, action);
		}
		play() {
			this.isPaused = false;
			this.control.playing = true;
			this.next();
			return this;
		}
		pause() {
			this.isPaused = true;
			this.control.playing = false;
			return this;
		}
		stop() {
			this.currentIndex = 0;
			if (this.currentActionInstance) this.currentActionInstance.executing = false;
			return this.pause();
		}
		clear() {
			this.stop();
			this.scriptContainer.actions.splice(0, this.scriptContainer.actions.length);
			return this;
		}
		private end = () => {
			this.stop();
		}
		private next = () => {
			if (!this.isPaused) {
				if (this.currentIndex >= 0 && this.currentIndex < this.scriptContainer.actions.length) {
					if (this.currentActionInstance) this.currentActionInstance.executing = false;
					this.currentActionInstance = this.scriptContainer.actions[this.currentIndex];
					this.currentActionInstance.executing = true;
					this.currentIndex++;
					mapActions[this.currentActionInstance.action.name](
						this.world, 
						this.currentIndex < this.scriptContainer.actions.length ? this.next : this.end);
				} else {
					this.end();
				}
			}
		}
	};

	

}