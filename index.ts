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
var availableActions = new robotcode.AvailableActions(script);



availableActions.add(actions.up).add(actions.down).add(actions.left).add(actions.right).add(actions.colorRed).add(actions.colorGreen);

var scriptContainer = document.querySelector(".scriptContainer");

scriptContainer.appendChild(availableActions.view);
scriptContainer.appendChild(script.view);

var gridView = new Vue({
	el: ".grid",
	data: grid
});

var robotView = new Vue({
	el: ".robot",
	data: robot
})