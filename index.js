/// <reference path="lib/tweenjs.d.ts" />
var CellMap = (function () {
    function CellMap() {
        this.createView();
    }
    CellMap.prototype.createView = function () {
        var div = document.createElement("div");
        div.className = "cell";
        this.view = div;
    };
    return CellMap;
})();
;

var GridMap = (function () {
    function GridMap(width, height) {
        this.width = width;
        this.height = height;
        var cells = [];
        for (var i = 0; i < this.width; ++i) {
            cells[i] = [];
            for (var j = 0; j < this.height; ++j) {
                var cellMap = new CellMap();
                cells[i][j] = cellMap;
            }
        }
        this.cellMaps = cells;
        this.createView();
    }
    GridMap.prototype.createView = function () {
        var div = document.createElement("div");
        var table = document.createElement("table");
        for (var j = 0; j < this.height; ++j) {
            var row = document.createElement("tr");
            for (var i = 0; i < this.width; ++i) {
                var cell = document.createElement("td");
                cell.appendChild(this.cellMaps[j][i].view);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        div.appendChild(table);
        div.className = "grid";
        this.view = div;
    };
    return GridMap;
})();
;

var Robot = (function () {
    function Robot() {
        this.createView();
        this.x = 0;
        this.y = 0;
    }
    Robot.prototype.createView = function () {
        var div = document.createElement("div");
        div.className = "robot";
        this.view = div;
    };
    Object.defineProperty(Robot.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this.view.style.left = value * 60 + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this.view.style.top = value * 60 + "px";
        },
        enumerable: true,
        configurable: true
    });
    return Robot;
})();
;

var World = (function () {
    function World(robot, grid) {
        this.robot = robot;
        this.grid = grid;
    }
    return World;
})();
;

var Action = (function () {
    function Action(name, act) {
        this.name = name;
        this.act = act;
    }
    return Action;
})();
;

var Script = (function () {
    function Script(world) {
        this.world = world;
        this.actions = [];
        this.currentIndex = 0;
        this.isPaused = true;
        this.bindNext = this.next.bind(this);
    }
    Script.prototype.add = function (action) {
        this.actions.push(action);
        return this;
    };
    Script.prototype.play = function () {
        this.isPaused = false;
        this.next();
        return this;
    };
    Script.prototype.pause = function () {
        this.isPaused = true;
        return this;
    };
    Script.prototype.stop = function () {
        this.currentIndex = 0;
        return this.pause();
    };

    Script.prototype.next = function () {
        if (!this.isPaused) {
            if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
                var action = this.actions[this.currentIndex];
                action.act(this.world, this.bindNext);
                this.currentIndex = (this.currentIndex + 1) % this.actions.length;
                if (this.currentIndex == 0) {
                    this.pause();
                }
            }
        }
    };
    return Script;
})();
;

var gridMap = new GridMap(6, 6);
var robot = new Robot();
gridMap.view.appendChild(robot.view);
var world = new World(robot, gridMap);
var script = new Script(world);

var up = new Action("up", function (world, callback) {
    var robot = world.robot;
    createjs.Tween.get(robot).to({ y: robot.y - 1 }, 1000).call(callback);
});

var down = new Action("down", function (world, callback) {
    var robot = world.robot;
    createjs.Tween.get(robot).to({ y: robot.y + 1 }, 1000).call(callback);
});

var left = new Action("left", function (world, callback) {
    var robot = world.robot;
    createjs.Tween.get(robot).to({ x: robot.x - 1 }, 1000).call(callback);
});

var right = new Action("right", function (world, callback) {
    var robot = world.robot;
    createjs.Tween.get(robot).to({ x: robot.x + 1 }, 1000).call(callback);
});

document.body.appendChild(gridMap.view);

script.add(down).add(right).add(right).add(up).add(left).play();
