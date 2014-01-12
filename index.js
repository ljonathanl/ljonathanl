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
        this.angle = 0;
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
    Object.defineProperty(Robot.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = value;
            this.view.style["webkitTransform"] = "rotate(" + value + "deg)";
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
        this.createView();
    }
    Script.prototype.createView = function () {
        var _this = this;
        var div = document.createElement("div");
        div.className = "script";
        this.view = div;
        var control = document.createElement("div");
        control.className = "controlBoard";
        div.appendChild(control);
        var actions = document.createElement("div");
        actions.className = "actions";
        div.appendChild(actions);
        this.actionsView = actions;
        var playButton = document.createElement("button");
        playButton.className = "control play";
        playButton.onclick = function () {
            _this.play();
        };
        control.appendChild(playButton);
        this.playButton = playButton;
        var pauseButton = document.createElement("button");
        pauseButton.className = "control pause";
        pauseButton.onclick = function () {
            _this.pause();
        };
        control.appendChild(pauseButton);
        pauseButton.style.display = "none";
        this.pauseButton = pauseButton;
        var stopButton = document.createElement("button");
        stopButton.className = "control stop";
        stopButton.onclick = function () {
            _this.stop();
        };
        control.appendChild(stopButton);
        var clearButton = document.createElement("button");
        clearButton.className = "control clear";
        clearButton.onclick = function () {
            _this.clear();
        };
        control.appendChild(clearButton);
    };
    Script.prototype.addActionView = function (action) {
        var button = document.createElement("button");
        button.className = "action " + action.name;
        this.actionsView.appendChild(button);
    };
    Script.prototype.add = function (action) {
        this.actions.push(action);
        this.addActionView(action);
        return this;
    };
    Script.prototype.play = function () {
        this.isPaused = false;
        this.playButton.style.display = "none";
        this.pauseButton.style.display = "inline";
        this.next();
        return this;
    };
    Script.prototype.pause = function () {
        this.isPaused = true;
        this.playButton.style.display = "inline";
        this.pauseButton.style.display = "none";
        return this;
    };
    Script.prototype.stop = function () {
        this.currentIndex = 0;
        return this.pause();
    };
    Script.prototype.clear = function () {
        this.actions.length = 0;
        while (this.actionsView.lastChild) {
            this.actionsView.removeChild(this.actionsView.lastChild);
        }
        return this.stop();
    };

    Script.prototype.next = function () {
        if (!this.isPaused) {
            if (this.currentIndex >= 0 && this.currentIndex < this.actions.length) {
                var currentActionView = this.actionsView.querySelector(".executing");
                if (currentActionView)
                    currentActionView.classList.remove("executing");
                currentActionView = this.actionsView.childNodes.item(this.currentIndex);
                currentActionView.className += " executing";
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

var AvailableActions = (function () {
    function AvailableActions(script) {
        this.script = script;
        this.actionsMap = {};
        this.actions = [];
        this.createView();
    }
    AvailableActions.prototype.add = function (action) {
        this.actionsMap[action.name] = action;
        this.actions.push(action);
        this.addActionView(action);
        return this;
    };
    AvailableActions.prototype.createView = function () {
        var div = document.createElement("div");
        div.className = "availableActions";
        this.view = div;
    };
    AvailableActions.prototype.addActionView = function (action) {
        var _this = this;
        var button = document.createElement("button");
        button.className = "action " + action.name;
        button.onclick = function () {
            _this.script.add(action);
        };
        this.view.appendChild(button);
    };
    return AvailableActions;
})();
;

var gridMap = new GridMap(10, 10);
var robot = new Robot();
gridMap.view.appendChild(robot.view);
var world = new World(robot, gridMap);
var script = new Script(world);
var availableActions = new AvailableActions(script);

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

var up = new Action("up", function (world, callback) {
    var robot = world.robot;
    rotate(robot, -90, function () {
        if (robot.y == 0) {
            createjs.Tween.get(robot).to({ y: -0.2 }, 300).to({ y: 0 }, 300).call(callback);
        } else {
            createjs.Tween.get(robot).to({ y: robot.y - 1 }, 1000).call(callback);
        }
    });
});

var down = new Action("down", function (world, callback) {
    var robot = world.robot;
    rotate(robot, 90, function () {
        if (robot.y >= world.grid.height - 1) {
            createjs.Tween.get(robot).to({ y: robot.y + 0.2 }, 300).to({ y: robot.y }, 300).call(callback);
        } else {
            createjs.Tween.get(robot).to({ y: robot.y + 1 }, 1000).call(callback);
        }
    });
});

var left = new Action("left", function (world, callback) {
    var robot = world.robot;
    rotate(robot, 180, function () {
        if (robot.x == 0) {
            createjs.Tween.get(robot).to({ x: -0.2 }, 300).to({ x: 0 }, 300).call(callback);
        } else {
            createjs.Tween.get(robot).to({ x: robot.x - 1 }, 1000).call(callback);
        }
    });
});

var right = new Action("right", function (world, callback) {
    var robot = world.robot;
    rotate(robot, 0, function () {
        if (robot.x >= world.grid.width - 1) {
            createjs.Tween.get(robot).to({ x: robot.x + 0.2 }, 300).to({ x: robot.x }, 300).call(callback);
        } else {
            createjs.Tween.get(robot).to({ x: robot.x + 1 }, 1000).call(callback);
        }
    });
});

availableActions.add(up).add(down).add(left).add(right);

var gridContainer = document.querySelector(".gridContainer");
var scriptContainer = document.querySelector(".scriptContainer");

gridContainer.appendChild(gridMap.view);
scriptContainer.appendChild(availableActions.view);
scriptContainer.appendChild(script.view);
