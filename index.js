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
        function Action(name, description) {
            this.name = name;
            this.description = description;
        }
        return Action;
    })();
    robotcode.Action = Action;
    ;

    var ActionInstance = (function () {
        function ActionInstance(action) {
            this.action = action;
            this.executing = false;
        }
        return ActionInstance;
    })();
    robotcode.ActionInstance = ActionInstance;
    ;

    var Control = (function () {
        function Control() {
        }
        return Control;
    })();
    robotcode.Control = Control;
    ;

    var AvailableActions = (function () {
        function AvailableActions(actions) {
            this.actions = actions;
        }
        return AvailableActions;
    })();
    robotcode.AvailableActions = AvailableActions;
    ;

    robotcode.mapActions = {};

    function setCellColor(grid, x, y, color) {
        var cell = grid.cells[x][y];
        if (cell) {
            cell.color = color;
        }
    }
    robotcode.setCellColor = setCellColor;

    function createGrid(gridValue) {
        var grid = new Grid();
        grid.width = gridValue.grid[0].length;
        grid.height = gridValue.grid.length;

        var cells = [];
        for (var i = 0; i < grid.width; ++i) {
            cells[i] = [];
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

    var Script = (function () {
        function Script(world) {
            var _this = this;
            this.world = world;
            this.actions = [];
            this.currentIndex = 0;
            this.isPaused = true;
            this.end = function () {
                _this.stop();
            };
            this.next = function () {
                if (!_this.isPaused) {
                    if (_this.currentIndex >= 0 && _this.currentIndex < _this.actions.length) {
                        if (_this.currentActionInstance)
                            _this.currentActionInstance.executing = false;
                        _this.currentActionInstance = _this.actions[_this.currentIndex];
                        _this.currentActionInstance.executing = true;
                        _this.currentIndex++;
                        robotcode.mapActions[_this.currentActionInstance.action.name](_this.world, _this.currentIndex < _this.actions.length ? _this.next : _this.end);
                    } else {
                        _this.end();
                    }
                }
            };
            this.control = new Control();
        }
        Script.prototype.add = function (action) {
            this.actions.push(new ActionInstance(action));
            return this;
        };
        Script.prototype.move = function (action, newIndex) {
            var lastIndex = this.actions.indexOf(action);
            this.actions.splice(lastIndex, 1);
            this.actions.splice(newIndex, 0, action);
        };
        Script.prototype.play = function () {
            this.isPaused = false;
            this.control.playing = true;
            this.next();
            return this;
        };
        Script.prototype.pause = function () {
            this.isPaused = true;
            this.control.playing = false;
            return this;
        };
        Script.prototype.stop = function () {
            this.currentIndex = 0;
            if (this.currentActionInstance)
                this.currentActionInstance.executing = false;
            return this.pause();
        };
        Script.prototype.clear = function () {
            this.actions.splice(0, this.actions.length);
            return this.stop();
        };
        return Script;
    })();
    robotcode.Script = Script;
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

    var color = function (color) {
        return function (world, callback) {
            var robot = world.robot;
            var grid = world.grid;
            robotcode.setCellColor(grid, robot.x, robot.y, color);
            setTimeout(callback, 500);
        };
    };

    actions.up = new robotcode.Action("up", "move up");
    actions.down = new robotcode.Action("down", "move down");
    actions.left = new robotcode.Action("left", "move left");
    actions.right = new robotcode.Action("right", "move right");
    actions.colorRed = new robotcode.Action("colorRed", "color tile in red");
    actions.colorGreen = new robotcode.Action("colorGreen", "color tile in green");

    robotcode.mapActions[actions.up.name] = move(0, -1, -90);
    robotcode.mapActions[actions.down.name] = move(0, 1, 90);
    robotcode.mapActions[actions.left.name] = move(-1, 0, 180);
    robotcode.mapActions[actions.right.name] = move(1, 0, 0);
    robotcode.mapActions[actions.colorRed.name] = color("#FF0000");
    robotcode.mapActions[actions.colorGreen.name] = color("#00FF00");
})(actions || (actions = {}));
/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />
/// <reference path="util.ts" />

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

var range = function (begin, end) {
    var offset = begin > end ? end : begin;
    var delta = Math.abs(end - begin);

    var result = [];
    for (var i = 0; i < delta; i++) {
        result.push(i + offset);
    }
    ;
    return result;
};

var grid = robotcode.createGrid(gridValue);
var robot = new robotcode.Robot();

var world = new robotcode.World(robot, grid);
var script = new robotcode.Script(world);
var availableActions = new robotcode.AvailableActions([actions.up, actions.down, actions.left, actions.right, actions.colorRed, actions.colorGreen]);

var gridView = new Vue({
    el: ".grid",
    data: grid,
    methods: {
        range: range
    }
});

var robotView = new Vue({
    el: ".robot",
    data: robot
});

var controlView = new Vue({
    el: ".controlBoard",
    data: script.control,
    methods: {
        play: function () {
            script.play();
        },
        pause: function () {
            script.pause();
        },
        clear: function () {
            script.clear();
        },
        stop: function () {
            script.stop();
        }
    }
});

var availableActionsView = new Vue({
    el: ".availableActions",
    data: availableActions,
    methods: {
        add: function (action) {
            script.add(action);
        }
    }
});

var scriptView = new Vue({
    el: ".script",
    data: {
        actions: script.actions
    }
});

/*var placeHolder:HTMLDivElement = document.createElement("div");
placeHolder.className = "action placeholder";
new DomUtil.DnDContainerBehavior(
document.querySelector(".script"),
placeHolder, (lastIndex:number, newIndex:number) => {
script.move(lastIndex, newIndex);
});*/
var sort = new Sortable(document.querySelector(".script"), {
    // handle: ".tile__title", // Restricts sort start click/touch to the specified element
    draggable: ".action",
    ghostClass: "placeholder",
    onUpdate: function (evt /**Event*/ ) {
        script.move(evt.item.vue_vm.$data.actionInstance, DomUtil.index(evt.item));
    }
});
