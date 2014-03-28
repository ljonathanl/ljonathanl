/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />

declare var Vue:any;
var gridValue = {
	colors: 
	{ 
		"B": "#000000",
		"W": "#CCCCCC",
		"R": "#FF0000",
	},
	grid:
	[
		"WWWWWBBBWW",
		"WBWWWWWWWW",
		"WWWWWBWWWW",
		"WWWWWWWWWB",
		"WWWBWWWWWW",
		"WWWWWWWWWB",
		"WWWWWWWWWW",
		"WWWBBWWWWW",
		"WWWWWBWWWW",
		"WWWWWWWWWW"
	]
}

var grid = robotcode.createGrid(gridValue);
var robot = new robotcode.Robot();

var world = new robotcode.World(robot, grid);
var script = new robotcode.Script(world);
var availableActions = new robotcode.AvailableActions([actions.up, actions.down, actions.left, actions.right, actions.colorRed, actions.colorGreen]);

var gridView = new Vue({
	el: ".grid",
	data: grid
});

var robotView = new Vue({
	el: ".robot",
	data: robot
});

var controlView = new Vue({
	el: ".controlBoard",
	data: script.control,
	methods: {
		play: ()=>{
			script.play();
		},
		pause: ()=>{
			script.pause();
		},
		clear: ()=>{
			script.clear();
		},
		stop: ()=>{
			script.stop();
		},
	}
});

var availableActionsView = new Vue({
	el: ".availableActions",
	data: availableActions,
	methods: {
		add: (action:robotcode.Action)=>{
			script.add(action);
		},
	}
});

var scriptView = new Vue({
	el: ".script",
	data: {
		actions: script.actions
	}
});


var placeHolder:HTMLDivElement = document.createElement("div");
placeHolder.className = "action placeholder";
new DomUtil.DnDContainerBehavior(
	document.querySelector(".script"), 
	placeHolder, (lastIndex:number, newIndex:number) => {
		script.move(lastIndex, newIndex);
	});