/// <reference path="lib/tweenjs.d.ts" />
/// <reference path="util.ts" />


class Cell {
	view:HTMLDivElement;
	constructor() {
		this.createView();
	}
	private createView() {
		var div = document.createElement("div");
		div.className = "cell";
		this.view = div;
	}
	set color(value:string) {
		this.view.style.backgroundColor = value;
	}
};

class Grid {
	view:HTMLDivElement;
	cells:Cell[][];
	constructor(public width, public height) {
		var cells:Cell[][] = [];
		for (var i = 0; i < this.width; ++i) {
			cells[i] = [];
			for (var j = 0; j < this.height; ++j) {
				var cell = new Cell();
				cells[i][j] = cell;
			}
		}		
		this.cells = cells;
		this.createView();
	}
	private createView() {
		var div = document.createElement("div");
		var table = document.createElement("table");
		for (var j = 0; j < this.height; ++j) {
			var row = document.createElement("tr");
			for (var i = 0; i < this.width; ++i) {
				var td = document.createElement("td");
				td.appendChild(this.cells[i][j].view);
				row.appendChild(td);
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
	private _angle:number;
	view:HTMLDivElement;
	constructor() {
		this.createView();
		this.x = 0;
		this.y = 0;
		this.angle = 0;
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
	set angle(value:number) {
		this._angle = value;
		this.view.style["webkitTransform"] = "rotate(" + value + "deg)";
	}
	get angle() {
		return this._angle;
	}
	
};

class World {
	constructor(public robot:Robot, public grid:Grid){}
};

class Action {
	constructor(public name:string, public act:(world:World, callback:()=>void)=>void){}
};

class Script {
	actions:Action[] = [];
	currentIndex:number = 0;
	isPaused:boolean = true;
	view: HTMLDivElement;
	actionsView: HTMLDivElement;
	playButton: HTMLButtonElement;
	pauseButton: HTMLButtonElement;
	constructor(public world:World) {
		this.createView();
	}
	private createView() {
		var div:HTMLDivElement = document.createElement("div");
		div.className = "script";
		this.view = div;
		var control:HTMLDivElement = document.createElement("div");
		control.className = "controlBoard";
		div.appendChild(control);
		var actions:HTMLDivElement = document.createElement("div");
		actions.className = "actions";
		div.appendChild(actions);
		this.actionsView = actions;
		var playButton:HTMLButtonElement = document.createElement("button");
		playButton.className = "control play";
		playButton.onclick = () => {
			this.play();
		};
		control.appendChild(playButton);
		this.playButton = playButton;
		var pauseButton:HTMLButtonElement = document.createElement("button");
		pauseButton.className = "control pause";
		pauseButton.onclick = () => {
			this.pause();
		};
		control.appendChild(pauseButton);
		pauseButton.style.display = "none";
		this.pauseButton = pauseButton;
		var stopButton:HTMLButtonElement = document.createElement("button");
		stopButton.className = "control stop";
		stopButton.onclick = () => {
			this.stop();
		};
		control.appendChild(stopButton);	
		var clearButton:HTMLButtonElement = document.createElement("button");
		clearButton.className = "control clear";
		clearButton.onclick = () => {
			this.clear();
		};
		control.appendChild(clearButton);
	}
	private addActionView(action:Action) {
		var button:HTMLButtonElement = document.createElement("button");
		button.className = "action " + action.name;
		this.actionsView.appendChild(button);
	}
	add(action:Action) {
		this.actions.push(action);
		this.addActionView(action);
		return this;
	}
	play() {
		this.isPaused = false;
		this.playButton.style.display = "none";
		this.pauseButton.style.display = "inline";
		this.next();
		return this;
	}
	pause() {
		this.isPaused = true;
		this.playButton.style.display = "inline";
		this.pauseButton.style.display = "none";
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
	private bindNext = this.next.bind(this);

	private next() {
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
				action.act(this.world, this.bindNext);
			}

		}
	}
};

class AvailableActions {
	actionsMap: {[key:string]:Action} = {};
	actions: Action[] = [];
	view:HTMLDivElement;
	constructor(public script:Script) {
		this.createView();
	}
	add(action:Action) {
		this.actionsMap[action.name] = action;
		this.actions.push(action);
		this.addActionView(action);
		return this;
	}
	private createView() {
		var div = document.createElement("div");
		div.className = "availableActions";
		this.view = div;
	}
	private addActionView(action:Action) {
		var button:HTMLButtonElement = document.createElement("button");
		button.className = "action " + action.name;
		button.onclick = () => {
			this.script.add(action);
		};
		this.view.appendChild(button);
	}
};


var grid = new Grid(10,10);
var robot = new Robot();
grid.view.appendChild(robot.view);
var world = new World(robot, grid);
var script = new Script(world);
var availableActions = new AvailableActions(script);

var rotate = (robot:Robot, angle:number, callback:()=>void):void => {
	if (robot.angle == angle || robot.angle == angle - 360) {
		callback();
	} else {
		if (Math.abs(robot.angle - angle) > Math.abs(robot.angle - (angle - 360))) {
			angle = angle - 360;
		}
		createjs.Tween.get(robot).to({angle:angle},500).call(callback);
	}
};

var up = new Action("up", (world, callback:()=>void) => {
		var robot = world.robot;
		rotate(robot, -90, () => {
			if (robot.y == 0) {
				createjs.Tween.get(robot).to({y:-0.2}, 300).to({y:0}, 300).call(callback);
			} else {
				createjs.Tween.get(robot).to({y:robot.y-1}, 1000).call(callback);
			}
		});	
	});

var down = new Action("down", (world, callback:()=>void) => {
		var robot = world.robot;
		rotate(robot, 90, () => {
			if (robot.y >= world.grid.height - 1) {
				createjs.Tween.get(robot).to({y:robot.y+0.2}, 300).to({y:robot.y}, 300).call(callback);
			} else {	
				createjs.Tween.get(robot).to({y:robot.y+1}, 1000).call(callback);
			}
		});
	});

var left = new Action("left", (world, callback:()=>void) => {
		var robot = world.robot;
		rotate(robot, 180, () => {
			if (robot.x == 0) {
				createjs.Tween.get(robot).to({x:-0.2}, 300).to({x:0}, 300).call(callback);
			} else {	
				createjs.Tween.get(robot).to({x:robot.x-1}, 1000).call(callback);
			}
		});
	});

var right = new Action("right", (world, callback:()=>void) => {
		var robot = world.robot;
		rotate(robot, 0, () => {
			if (robot.x >= world.grid.width - 1) {
				createjs.Tween.get(robot).to({x:robot.x+0.2}, 300).to({x:robot.x}, 300).call(callback);
			} else {	
				createjs.Tween.get(robot).to({x:robot.x+1}, 1000).call(callback);
			}
		});
	});

var color = function (color:string) {
	return (world:World, callback:()=>void) => {
		var robot = world.robot;
		var grid = world.grid;
		var cell = grid.cells[robot.x][robot.y];
		cell.color = color;
		callback();
	}
};

var colorRed = new Action("colorRed", color("#FF0000"));
var colorGreen = new Action("colorGreen", color("#00FF00"));

availableActions.add(up).add(down).add(left).add(right).add(colorRed).add(colorGreen);

var gridContainer = document.querySelector(".gridContainer");
var scriptContainer = document.querySelector(".scriptContainer");

gridContainer.appendChild(grid.view);
scriptContainer.appendChild(availableActions.view);
scriptContainer.appendChild(script.view);
