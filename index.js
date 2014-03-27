var DomUtil;
(function (DomUtil) {
    function before(element, insert) {
        if (element.parentNode) {
            element.parentNode.insertBefore(insert, element);
        }
    }
    DomUtil.before = before;

    function after(element, insert) {
        if (element.parentNode) {
            element.parentNode.insertBefore(insert, element.nextSibling);
        }
    }
    DomUtil.after = after;

    function index(element) {
        for (var k = 0, e = element; e = e.previousElementSibling; ++k)
            ;
        return k;
    }
    DomUtil.index = index;

    var Statuses;
    (function (Statuses) {
        Statuses[Statuses["off"] = 0] = "off";
        Statuses[Statuses["start"] = 1] = "start";
        Statuses[Statuses["enter"] = 2] = "enter";
    })(Statuses || (Statuses = {}));
    ;

    var DnDContainerBehavior = (function () {
        function DnDContainerBehavior(element, placeHolder, callback) {
            this.element = element;
            this.placeHolder = placeHolder;
            this.callback = callback;
            this.draggedElement = null;
            this.status = 0 /* off */;
            this.lastIndex = -1;
            this.draggedElementDisplayStyle = null;
            this.element.addEventListener('dragstart', this.handleDragStart.bind(this), false);
            this.element.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
            this.element.addEventListener('dragend', this.handleDragEnd.bind(this), false);
        }
        DnDContainerBehavior.prototype.handleDragStart = function (e) {
            this.draggedElement = e.target;
            e.dataTransfer.effectAllowed = 'move';
            this.status = 1 /* start */;
            this.lastIndex = index(this.draggedElement);
            this.draggedElementDisplayStyle = this.draggedElement.style.display;
        };

        DnDContainerBehavior.prototype.handleDragEnd = function (e) {
            this.draggedElement.style.display = this.draggedElementDisplayStyle;
            this.status = 0 /* off */;
            before(this.placeHolder, this.draggedElement);
            this.element.removeChild(this.placeHolder);
            var lastIndex = this.lastIndex;
            var newIndex = index(this.draggedElement);
            this.lastIndex = -1;
            this.draggedElement = null;
            this.draggedElementDisplayStyle = null;
            this.callback(lastIndex, newIndex);
        };

        DnDContainerBehavior.prototype.handleDragEnter = function (e) {
            if (this.status == 1 /* start */) {
                this.draggedElement.style.display = "none";
                this.status = 2 /* enter */;
            }
            var element = e.target;
            if (element.parentNode == this.element) {
                var indexPlaceHolder = index(this.placeHolder);
                var indexElement = index(element);
                if (indexPlaceHolder < indexElement) {
                    after(element, this.placeHolder);
                } else {
                    before(element, this.placeHolder);
                }
            }
        };
        return DnDContainerBehavior;
    })();
    DomUtil.DnDContainerBehavior = DnDContainerBehavior;
})(DomUtil || (DomUtil = {}));
/// <reference path="util.ts" />
var robotcode;
(function (robotcode) {
    function createGrid(gridValue) {
        var grid = new Grid();
        grid.width = gridValue.grid[0].length;
        grid.height = gridValue.grid.length;

        var cells = [];
        for (var i = 0; i < grid.width; ++i) {
            cells[i] = [];
            var row = gridValue.grid[0];
            for (var j = 0; j < grid.height; ++j) {
                var cell = new Cell();
                cell.color = gridValue.colors[gridValue.grid[j][i]];
                cells[i][j] = cell;
            }
        }
        grid.cells = cells;
        return grid;
    }
    robotcode.createGrid = createGrid;

    function canMove(grid, x, y) {
        if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
            return grid.cells[x][y].color != "#000000";
        }
        return false;
    }
    robotcode.canMove = canMove;

    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    })();
    robotcode.Cell = Cell;
    ;

    var Grid = (function () {
        function Grid() {
        }
        return Grid;
    })();
    robotcode.Grid = Grid;
    ;

    var Robot = (function () {
        function Robot() {
            this.x = 0;
            this.y = 0;
            this.angle = 0;
        }
        return Robot;
    })();
    robotcode.Robot = Robot;
    ;

    var World = (function () {
        function World(robot, grid) {
            this.robot = robot;
            this.grid = grid;
        }
        return World;
    })();
    robotcode.World = World;
    ;

    var Action = (function () {
        function Action(name, act) {
            this.name = name;
            this.act = act;
        }
        return Action;
    })();
    robotcode.Action = Action;
    ;

    var Script = (function () {
        function Script(world) {
            var _this = this;
            this.world = world;
            this.actions = [];
            this.currentIndex = 0;
            this.isPaused = true;
            this.next = function () {
                if (!_this.isPaused) {
                    if (_this.currentIndex >= 0 && _this.currentIndex < _this.actions.length) {
                        var currentActionView = _this.actionsView.querySelector(".executing");
                        if (currentActionView)
                            currentActionView.classList.remove("executing");
                        currentActionView = _this.actionsView.childNodes.item(_this.currentIndex);
                        currentActionView.className += " executing";
                        var action = _this.actions[_this.currentIndex];
                        _this.currentIndex = (_this.currentIndex + 1) % _this.actions.length;
                        if (_this.currentIndex == 0) {
                            _this.pause();
                        }
                        action.act(_this.world, _this.next);
                    }
                }
            };
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
            var placeHolder = document.createElement("div");
            placeHolder.className = "action placeholder";
            new DomUtil.DnDContainerBehavior(actions, placeHolder, this.move.bind(this));
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
            button.draggable = true;
            this.actionsView.appendChild(button);
        };
        Script.prototype.add = function (action) {
            this.actions.push(action);
            this.addActionView(action);
            return this;
        };
        Script.prototype.move = function (lastIndex, newIndex) {
            var action = this.actions[lastIndex];
            this.actions.splice(lastIndex, 1);
            this.actions.splice(newIndex, 0, action);
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
        return Script;
    })();
    robotcode.Script = Script;
    ;

    var AvailableActions = (function () {
        function AvailableActions(script) {
            this.script = script;
            this.actions = [];
            this.createView();
        }
        AvailableActions.prototype.add = function (action) {
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
    robotcode.AvailableActions = AvailableActions;
    ;
})(robotcode || (robotcode = {}));
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
                if (!robotcode.canMove(grid, robot.x + offsetX, robot.y + offsetY)) {
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
/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />
var gridValue = {
    colors: {
        "B": "#000000",
        "W": "#CCCCCC",
        "R": "#FF0000"
    },
    grid: [
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
};

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
});
