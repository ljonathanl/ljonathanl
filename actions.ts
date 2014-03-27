/// <reference path="robotcode.ts" />
/// <reference path="lib/tweenjs.d.ts" />

module actions {
	var rotate = (robot:robotcode.Robot, angle:number, callback:()=>void):void => {
		if (robot.angle == angle || robot.angle == angle - 360) {
			callback();
		} else {
			if (Math.abs(robot.angle - angle) > Math.abs(robot.angle - (angle - 360))) {
				angle = angle - 360;
			}
			createjs.Tween.get(robot).to({angle:angle},500).call(callback);
		}
	};

	var move = function (offsetX:number, offsetY:number, angle:number) {
		return (world:robotcode.World, callback:()=>void) => {
			var robot = world.robot;
			var grid = world.grid;
			rotate(robot, angle, () => {
				if (!robotcode.canMove(grid, robot.x + offsetX, robot.y + offsetY)) {
					createjs.Tween.get(robot).to({x:robot.x + offsetX * 0.2, y:robot.y + offsetY * 0.2}, 300).to({x:robot.x, y:robot.y}, 300).call(callback);
				} else {
					createjs.Tween.get(robot).to({x:robot.x + offsetX, y:robot.y + offsetY}, 1000).call(callback);
				}
			});
		}	
	};

	export var up = new robotcode.Action("up", move(0, -1, -90));

	export var down = new robotcode.Action("down", move(0, 1, 90));
	
	export var left = new robotcode.Action("left", move(-1, 0, 180));
	
	export var right = new robotcode.Action("right", move(1, 0, 0));

	var color = function (color:string) {
		return (world:robotcode.World, callback:()=>void) => {
			var robot = world.robot;
			var grid = world.grid;
			var cell = grid.cells[robot.x][robot.y];
			cell.color = color;
			setTimeout(callback, 500);
		}
	};

	export var colorRed = new robotcode.Action("colorRed", color("#FF0000"));
	export var colorGreen = new robotcode.Action("colorGreen", color("#00FF00"));


}