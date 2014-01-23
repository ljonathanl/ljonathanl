/// <reference path="robotcode.ts" />
/// <reference path="lib/tweenjs.d.ts" />
var actions;
(function (actions) {
    var rotate = function (robot, angle, callback) {
        if (robot.angle == angle || robot.angle == angle - 360) {
            callback();
        } else {
            if (Math.abs(robot.angle - angle) > Math.abs(robot.angle - (angle - 360))) {
                angle = angle - 360;
            }
            createjs.Tween.get(robot).to({ angle: angle }, 500).call(callback);
        }
    };

    actions.up = new robotcode.Action("up", function (world, callback) {
        var robot = world.robot;
        rotate(robot, -90, function () {
            if (robot.y == 0) {
                createjs.Tween.get(robot).to({ y: -0.2 }, 300).to({ y: 0 }, 300).call(callback);
            } else {
                createjs.Tween.get(robot).to({ y: robot.y - 1 }, 1000).call(callback);
            }
        });
    });

    actions.down = new robotcode.Action("down", function (world, callback) {
        var robot = world.robot;
        rotate(robot, 90, function () {
            if (robot.y >= world.grid.height - 1) {
                createjs.Tween.get(robot).to({ y: robot.y + 0.2 }, 300).to({ y: robot.y }, 300).call(callback);
            } else {
                createjs.Tween.get(robot).to({ y: robot.y + 1 }, 1000).call(callback);
            }
        });
    });

    actions.left = new robotcode.Action("left", function (world, callback) {
        var robot = world.robot;
        rotate(robot, 180, function () {
            if (robot.x == 0) {
                createjs.Tween.get(robot).to({ x: -0.2 }, 300).to({ x: 0 }, 300).call(callback);
            } else {
                createjs.Tween.get(robot).to({ x: robot.x - 1 }, 1000).call(callback);
            }
        });
    });

    actions.right = new robotcode.Action("right", function (world, callback) {
        var robot = world.robot;
        rotate(robot, 0, function () {
            if (robot.x >= world.grid.width - 1) {
                createjs.Tween.get(robot).to({ x: robot.x + 0.2 }, 300).to({ x: robot.x }, 300).call(callback);
            } else {
                createjs.Tween.get(robot).to({ x: robot.x + 1 }, 1000).call(callback);
            }
        });
    });

    var color = function (color) {
        return function (world, callback) {
            var robot = world.robot;
            var grid = world.grid;
            var cell = grid.cells[robot.x][robot.y];
            cell.color = color;
            callback();
        };
    };

    actions.colorRed = new robotcode.Action("colorRed", color("#FF0000"));
    actions.colorGreen = new robotcode.Action("colorGreen", color("#00FF00"));
})(actions || (actions = {}));
