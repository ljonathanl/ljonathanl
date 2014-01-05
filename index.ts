/// <reference path="lib/tweenjs.d.ts" />


class CellMap {
	public view:HTMLDivElement;
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
	public view:HTMLDivElement;
	public cellMaps:CellMap[][];
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


class Promise {
	private callback: () => void;
	private finish:boolean = false;
	constructor(){}
	public then(callback: () => void) {
		this.callback = callback;
		if (this.finish) {
			this.done();
		}
	}
	public done() {
		this.finish = true;
		if (typeof(this.callback) == "function") {
			console.log("done callback");
			this.callback();
		}
	}
};


class Robot {
	private _x:number;
	private _y:number;
	public view:HTMLDivElement;
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
	public set x(value:number) {
		this._x = value;
		this.view.style.left = value * 60 + "px";
	}
	public get x() {
		return this._x;
	}
	public set y(value:number) {
		this._y = value;
		this.view.style.top = value * 60 + "px";
	}
	public get y() {
		return this._y;
	}

	
};

class World {
	constructor(public robot:Robot, public grid:GridMap){}
};

class Script {
	public actions:any[] = [];
	public currentIndex:number = 0;
	public isPaused:boolean = true;
	constructor(public world:World) {}
	public add(action: () => void) {
		this.actions.push(action);
		return this;
	}
	public play() {
		this.isPaused = false;
		this.next();
		return this;
	}
	public pause() {
		this.isPaused = true;
		return this;
	}
	public stop() {
		this.currentIndex = 0;
		return this.pause();
	}
	private next() {
		if (!this.isPaused) {
			if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
				var action:()=>void = this.actions[this.currentIndex];
				action.apply(this);
				this.currentIndex = (this.currentIndex + 1) % this.actions.length;
				if (this.currentIndex == 0) {
					this.pause();
				}
			}

		}
	}

	public up() {
		var robot = this.world.robot;
		createjs.Tween.get(robot).to({y:robot.y-1}, 1000).call(this.next, null, this);
	}
	public down() {
		var robot = this.world.robot;
		createjs.Tween.get(robot).to({y:robot.y+1}, 1000).call(this.next, null, this);
	}
	public right() {
		var robot = this.world.robot;
		createjs.Tween.get(robot).to({x:robot.x+1}, 1000).call(this.next, null, this);
	}
	public left() {
		var robot = this.world.robot;
		createjs.Tween.get(robot).to({x:robot.x-1}, 1000).call(this.next, null, this);
	}
};


var gridMap = new GridMap(6,6);
var robot = new Robot();
gridMap.view.appendChild(robot.view);
var world = new World(robot, gridMap);
var script = new Script(world);


document.body.appendChild(gridMap.view);

script.add(script.down).add(script.right).add(script.right).add(script.up).add(script.left).play();