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
		constructor(public name:string){}
	};

	export class ActionInstance {
		executing:boolean = false;
		constructor(public action:Action){}
	};

	export class Control {
		playing:boolean;
	};

	export class AvailableActions {
		constructor(public actions:Action[]){}
	};	

	export var mapActions:{[key:string]:(world:robotcode.World, callback:()=>void)=>void} = {};

	export function setCellColor(grid:Grid, x:number, y:number, color:string) {
		var cell = grid.cells[x][y];
		if (cell) {
			cell.color = color;
		}
	}



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

	export function canMove(grid:Grid, x:number, y:number):boolean {
		if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
			return grid.cells[x][y].color != "#000000";
		}
		return false;
	}



	export class Script {
		actions:ActionInstance[] = [];
		currentIndex:number = 0;
		currentActionInstance:ActionInstance;
		isPaused:boolean = true;
		control:Control;
		constructor(public world:World) {
			this.control = new Control();
		}
		add(action:Action) {
			this.actions.push(new ActionInstance(action));
			return this;
		}
		move(action:ActionInstance, newIndex:number) {
			var lastIndex = this.actions.indexOf(action);
			this.actions.splice(lastIndex, 1);
			this.actions.splice(newIndex, 0, action);
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
			this.actions.splice(0, this.actions.length);
			return this.stop();
		}
		private end = () => {
			this.stop();
		}
		private next = () => {
			if (!this.isPaused) {
				if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
					if (this.currentActionInstance) this.currentActionInstance.executing = false;
					this.currentActionInstance = this.actions[this.currentIndex];
					this.currentActionInstance.executing = true;
					this.currentIndex++;
					mapActions[this.currentActionInstance.action.name](
						this.world, 
						this.currentIndex < this.actions.length ? this.next : this.end);
				} else {
					this.end();
				}
			}
		}
	};

	

}