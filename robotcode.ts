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

	export class Control {
		playing:boolean;
	}

	export class AvailableActions {
		actions: Action[] = [];
	};	

	export var mapActions:{[key:string]:(world:robotcode.World, callback:()=>void)=>void} = {};

	export function setCellColor(grid:Grid, x:number, y:number, color:string) {
		var cell = grid.cells[y][x];
		if (cell) {
			cell.color = color;
		}
	}



	export function createGrid(gridValue:GridValue):Grid {
		var grid = new Grid();
		grid.width = gridValue.grid[0].length;
		grid.height = gridValue.grid.length;

		var cells:Cell[][] = [];
		for (var j = 0; j < grid.height; ++j) {
			cells[j] = [];
			var row = gridValue.grid[0]
			for (var i = 0; i < grid.width; ++i) {
				var cell = new Cell();
				cell.color = gridValue.colors[gridValue.grid[j][i]];
				cells[j][i] = cell;
			}
		}		
		grid.cells = cells;
		return grid;
	}

	export function canMove(grid:Grid, x:number, y:number):boolean {
		if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
			return grid.cells[y][x].color != "#000000";
		}
		return false;
	}



	export class Script {
		actions:Action[] = [];
		currentIndex:number = 0;
		isPaused:boolean = true;
		view: HTMLDivElement;
		actionsView: HTMLDivElement;
		control:Control;
		constructor(public world:World) {
			this.createView();
			this.control = new Control();
		}
		private createView() {
			var div:HTMLDivElement = document.createElement("div");
			div.className = "script";
			this.view = div;
			var actions:HTMLDivElement = document.createElement("div");
			actions.className = "actions";
			div.appendChild(actions);
			this.actionsView = actions;
			var placeHolder:HTMLDivElement = document.createElement("div");
			placeHolder.className = "action placeholder";
			new DomUtil.DnDContainerBehavior(actions, placeHolder, this.move.bind(this));
			var playButton:HTMLButtonElement = document.createElement("button");
		}
		private addActionView(action:Action) {
			var button:HTMLButtonElement = document.createElement("button");
			button.className = "action " + action.name;
			button.draggable = true;
			this.actionsView.appendChild(button);
		}
		add(action:Action) {
			this.actions.push(action);
			this.addActionView(action);
			return this;
		}
		move(lastIndex:number, newIndex:number) {
			var action:Action = this.actions[lastIndex];
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
			return this.pause();
		}
		clear() {
			this.actions.length = 0;
			while (this.actionsView.lastChild) {
				this.actionsView.removeChild(this.actionsView.lastChild);
			}
			return this.stop();
		}

		private next = () => {
			if (!this.isPaused) {
				if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
					var currentActionView = <HTMLButtonElement>this.actionsView.querySelector(".executing");
					if (currentActionView) currentActionView.classList.remove("executing");
					currentActionView = <HTMLButtonElement>this.actionsView.childNodes.item(this.currentIndex);
					currentActionView.className += " executing"; 
					var action = this.actions[this.currentIndex];
					this.currentIndex = (this.currentIndex + 1) % this.actions.length;
					if (this.currentIndex == 0) {
						this.pause();
					}
					mapActions[action.name](this.world, this.next);
				}

			}
		}
	};

	

}