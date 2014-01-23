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

    var move = function (offsetX, offsetY, angle) {
        return function (world, callback) {
            var robot = world.robot;
            var grid = world.grid;
            rotate(robot, angle, function () {
                if (!grid.canMove(robot.x + offsetX, robot.y + offsetY)) {
                    createjs.Tween.get(robot).to({ x: robot.x + offsetX * 0.2, y: robot.y + offsetY * 0.2 }, 300).to({ x: robot.x, y: robot.y }, 300).call(callback);
                } else {
                    createjs.Tween.get(robot).to({ x: robot.x + offsetX, y: robot.y + offsetY }, 1000).call(callback);
                }
            });
        };
    };

    actions.up = new robotcode.Action("up", move(0, -1, -90));

    actions.down = new robotcode.Action("down", move(0, 1, 90));

    actions.left = new robotcode.Action("left", move(-1, 0, 180));

    actions.right = new robotcode.Action("right", move(1, 0, 0));

    var color = function (color) {
        return function (world, callback) {
            var robot = world.robot;
            var grid = world.grid;
            var cell = grid.cells[robot.x][robot.y];
            cell.color = color;
            setTimeout(callback, 500);
        };
    };

    actions.colorRed = new robotcode.Action("colorRed", color("#FF0000"));
    actions.colorGreen = new robotcode.Action("colorGreen", color("#00FF00"));
})(actions || (actions = {}));
