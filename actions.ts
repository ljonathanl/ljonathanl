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

	export var up = new robotcode.Action("up", (world, callback:()=>void) => {
			var robot = world.robot;
			rotate(robot, -90, () => {
				if (robot.y == 0) {
					createjs.Tween.get(robot).to({y:-0.2}, 300).to({y:0}, 300).call(callback);
				} else {
					createjs.Tween.get(robot).to({y:robot.y-1}, 1000).call(callback);
				}
			});	
		});

	export var down = new robotcode.Action("down", (world, callback:()=>void) => {
			var robot = world.robot;
			rotate(robot, 90, () => {
				if (robot.y >= world.grid.height - 1) {
					createjs.Tween.get(robot).to({y:robot.y+0.2}, 300).to({y:robot.y}, 300).call(callback);
				} else {	
					createjs.Tween.get(robot).to({y:robot.y+1}, 1000).call(callback);
				}
			});
		});

	export var left = new robotcode.Action("left", (world, callback:()=>void) => {
			var robot = world.robot;
			rotate(robot, 180, () => {
				if (robot.x == 0) {
					createjs.Tween.get(robot).to({x:-0.2}, 300).to({x:0}, 300).call(callback);
				} else {	
					createjs.Tween.get(robot).to({x:robot.x-1}, 1000).call(callback);
				}
			});
		});

	export var right = new robotcode.Action("right", (world, callback:()=>void) => {
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