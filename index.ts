/// <reference path="robotcode.ts" />
/// <reference path="actions.ts" />
/// <reference path="util.ts" />

declare var Vue:any;
declare var Sortable:any;
var gridValue = {
	colors: 
	{ 
		"B": "#000000",
		"W": "#CCCCCC",
		"R": "#FF0000",
	},
	grid:
	[
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
}

var range = function(begin:number, end:number) {
	var offset = begin > end ? end : begin;
    var delta = Math.abs(end - begin);

    var result = [];
    for (var i = 0; i < delta; i++) {
        result.push(i + offset);
    };
    return result;
}

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
		play: ()=>{
			script.play();
		},
		pause: ()=>{
			script.pause();
		},
		clear: ()=>{
			script.clear();
		},
		stop: ()=>{
			script.stop();
		},
	}
});

var availableActionsView = new Vue({
	el: ".availableActions",
	data: availableActions,
	methods: {
		add: (action:robotcode.Action)=>{
			script.add(action);
		},
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
  draggable: ".action", // Specifies which items inside the element should be sortable
  ghostClass: "placeholder",
  onUpdate: function (evt:any/**Event*/){
  	script.move(evt.item.vue_vm.$data.actionInstance, DomUtil.index(evt.item));
  }
});