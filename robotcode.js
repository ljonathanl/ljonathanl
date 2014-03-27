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
        function Grid(gridValue) {
            this.gridValue = gridValue;
            this.width = gridValue.grid[0].length;
            this.height = gridValue.grid.length;

            var cells = [];
            for (var i = 0; i < this.width; ++i) {
                cells[i] = [];
                var row = gridValue.grid[0];
                for (var j = 0; j < this.height; ++j) {
                    var cell = new Cell();
                    cell.color = gridValue.colors[gridValue.grid[j][i]];
                    cells[i][j] = cell;
                }
            }
            this.cells = cells;
        }
        Grid.prototype.canMove = function (x, y) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                return this.cells[x][y].color != "#000000";
            }
            return false;
        };
        return Grid;
    })();
    robotcode.Grid = Grid;
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
