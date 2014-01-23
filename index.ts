/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />

var grid = new robotcode.Grid(10,10);
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
