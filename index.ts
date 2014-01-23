/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />

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
		"WWWBBWRRWW",
		"WWWWWBWWWW",
		"WWWWWWWWWW"
	]
}

var grid = new robotcode.Grid(gridValue);
var robot = new robotcode.Robot();
grid.view.appendChild(robot.view);
var world = new robotcode.World(robot, grid);
var script = new robotcode.Script(world);
var availableActions = new robotcode.AvailableActions(script);



availableActions.add(actions.up).add(actions.down).add(actions.left).add(actions.right).add(actions.colorRed).add(actions.colorGreen);

var gridContainer = document.querySelector(".gridContainer");
var scriptContainer = document.querySelector(".scriptContainer");

gridContainer.appendChild(grid.view);
scriptContainer.appendChild(availableActions.view);
scriptContainer.appendChild(script.view);


