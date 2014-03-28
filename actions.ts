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

	var color = function (color:string) {
		return (world:robotcode.World, callback:()=>void) => {
			var robot = world.robot;
			var grid = world.grid;
			robotcode.setCellColor(grid, robot.x, robot.y, color);
			setTimeout(callback, 500);
		}
	};

	export var up = new robotcode.Action("up");
	export var down = new robotcode.Action("down");
	export var left = new robotcode.Action("left");
	export var right = new robotcode.Action("right");
	export var colorRed = new robotcode.Action("colorRed");
	export var colorGreen = new robotcode.Action("colorGreen");

	robotcode.mapActions[up.name] = move(0, -1, -90);
	robotcode.mapActions[down.name] = move(0, 1, 90);
	robotcode.mapActions[left.name] = move(-1, 0, 180);
	robotcode.mapActions[right.name] = move(1, 0, 0);
	robotcode.mapActions[colorRed.name] = color("#FF0000");
	robotcode.mapActions[colorGreen.name] = color("#00FF00");
}