/// <reference path="lib/tweenjs.d.ts" />


class CellMap {
	view:HTMLDivElement;
	constructor() {
		this.createView();
	}
	private createView() {
		var div = document.createElement("div");
		div.className = "cell";
		this.view = div;
	}

};

class GridMap {
	view:HTMLDivElement;
	cellMaps:CellMap[][];
	constructor(public width, public height) {
		var cells:CellMap[][] = [];
		for (var i = 0; i < this.width; ++i) {
			cells[i] = [];
			for (var j = 0; j < this.height; ++j) {
				var cellMap = new CellMap();
				cells[i][j] = cellMap;
			}
		}		
		this.cellMaps = cells;
		this.createView();
	}
	private createView() {
		var div = document.createElement("div");
		var table = document.createElement("table");
		for (var j = 0; j < this.height; ++j) {
			var row = document.createElement("tr");
			for (var i = 0; i < this.width; ++i) {
				var cell = document.createElement("td");
				cell.appendChild(this.cellMaps[j][i].view);
				row.appendChild(cell);
			}
			table.appendChild(row);		
		}
		div.appendChild(table);
		div.className = "grid";
		this.view = div;
	}  
};

class Robot {
	private _x:number;
	private _y:number;
	view:HTMLDivElement;
	constructor() {
		this.createView();
		this.x = 0;
		this.y = 0;
	}
	private createView() {
		var div = document.createElement("div");
		div.className = "robot";
		this.view = div;
	}
	set x(value:number) {
		this._x = value;
		this.view.style.left = value * 60 + "px";
	}
	get x() {
		return this._x;
	}
	set y(value:number) {
		this._y = value;
		this.view.style.top = value * 60 + "px";
	}
	get y() {
		return this._y;
	}

	
};

class World {
	constructor(public robot:Robot, public grid:GridMap){}
};

class Action {
	constructor(public world:World, public name:string, public act:(callback:()=>void)=>void){}
};

class Script {
	actions:Action[] = [];
	currentIndex:number = 0;
	isPaused:boolean = true;
	constructor(public world:World) {}
	add(action:Action) {
		this.actions.push(action);
		return this;
	}
	play() {
		this.isPaused = false;
		this.next();
		return this;
	}
	pause() {
		this.isPaused = true;
		return this;
	}
	stop() {
		this.currentIndex = 0;
		return this.pause();
	}
	private bindNext = this.next.bind(this);

	private next() {
		if (!this.isPaused) {
			if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
				var action = this.actions[this.currentIndex];
				action.act(this.bindNext);
				this.currentIndex = (this.currentIndex + 1) % this.actions.length;
				if (this.currentIndex == 0) {
					this.pause();
				}
			}

		}
	}

};


var gridMap = new GridMap(6,6);
var robot = new Robot();
gridMap.view.appendChild(robot.view);
var world = new World(robot, gridMap);
var script = new Script(world);

var up = new Action(world, "up", (callback:()=>void) => {
		var robot = this.world.robot;	
		createjs.Tween.get(robot).to({y:robot.y-1}, 1000).call(callback);
	});

var down = new Action(world, "down", (callback:()=>void) => {
		var robot = this.world.robot;	
		createjs.Tween.get(robot).to({y:robot.y+1}, 1000).call(callback);
	});

var left = new Action(world, "left", (callback:()=>void) => {
		var robot = this.world.robot;	
		createjs.Tween.get(robot).to({x:robot.x-1}, 1000).call(callback);
	});

var right = new Action(world, "right", (callback:()=>void) => {
		var robot = this.world.robot;	
		createjs.Tween.get(robot).to({x:robot.x+1}, 1000).call(callback);
	});

document.body.appendChild(gridMap.view);

script.add(down).add(right).add(right).add(up).add(left).play();