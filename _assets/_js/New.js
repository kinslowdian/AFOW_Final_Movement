
var control;

var HIT_TEST;

var Control = function()
{
	this.fl = {};
}

Control.prototype.init = function()
{
	this.fl.x 				= 0;
	this.fl.x_target 	= 0;
	this.fl.x_safe		= 0;

	this.fl.y 				= 0;
	this.fl.y_target 	= 0;
	this.fl.y_safe		= 0;

	this.fl.move			= 40;
	this.animate 			= false;

	this.signal				= "";

	this.keyChange		= false;
}

Control.prototype.updateXY = function(x, y)
{
	this.fl.x_target += x;
	this.fl.y_target += y;
}

Control.prototype.touch_initPad = function(touchArea)
{
	this.touchArea = touchArea;
	this.firstTouch = true;
	this.enableTouch = false;

	this.touchData = {};

	this.touchData.moveDirection = "";
	this.touchData.indicator			= "";

	this.touchData.x_measure 		= $("#" + this.touchArea).width();
	this.touchData.y_measure 		= $("#" + this.touchArea).height();
}

Control.prototype.touch_setOffset = function()
{
	this.touchData.offset = $("#" + this.touchArea).offset();
}

Control.prototype.touch_reset = function()
{
	this.dir = "STILL";
	this.touchData.x_percent 		= 0;
	this.touchData.y_percent 		= 0;
}

Control.prototype.walkClassUpdate = function(str)
{

}


function control_init()
{
	control = new Control();

	control.init();

	hitTest_init();

	// TODO IF NEEDED
	touch_init();

	// TouchUI.js
	$(window)[0].addEventListener("touchstart", touch_lock, false);
}

function touch_lock(event)
{
	event.preventDefault();
}

function control_run(run)
{
	if(run)
	{
		// CONTROLS
		$(window)[0].addEventListener("keydown", control_event, false);
		$(window)[0].addEventListener("keyup", control_event, false);

		$("#touchPad-full")[0].addEventListener("touchstart", touch_find, false);
		$("#touchPad-full")[0].addEventListener("touchmove", touch_find, false);
		$("#touchPad-full")[0].addEventListener("touchend", touch_find, false);

		// PLAYER
		$(".player").addClass("tween-controlPlayer");

		$(".tween-controlPlayer")[0].addEventListener("webkitTransitionEnd", control_cssAddEvent, false);
		$(".tween-controlPlayer")[0].addEventListener("transitionend", control_cssAddEvent, false);
	}

	else
	{
		// CONTROLS
		$(window)[0].removeEventListener("keydown", control_event, false);
		$(window)[0].removeEventListener("keyup", control_event, false);

		// PLAYER
		$(".tween-controlPlayer")[0].removeEventListener("webkitTransitionEnd", control_cssAddEvent, false);
		$(".tween-controlPlayer")[0].removeEventListener("transitionend", control_cssAddEvent, false);

		$(".player").removeClass("tween-controlPlayer");
	}
}

function control_event(event)
{
	if(event.type === "keyup")
	{
		control.signal = "STILL";
	}

	if(event.type === "keydown")
	{
		// U
		if(event.keyCode == 38 && control.signal !== "UP")
		{
			control.signal = "UP";

			control.keyChange = true;
		}

		// D
		else if(event.keyCode == 40 && control.signal !== "DOWN")
		{
			control.signal = "DOWN";

			control.keyChange = true;
		}

		// L
		else if(event.keyCode == 37 && control.signal !== "LEFT")
		{
			control.signal = "LEFT";

			control.keyChange = true;
		}

		// R
		else if(event.keyCode == 39 && control.signal !== "RIGHT")
		{
			control.signal = "RIGHT";

			control.keyChange = true;
		}
	}

	trace(control.signal);

	if(control.keyChange)
	{
		control.keyChange = false;

		control_listen();
	}
}

function control_listen()
{
	var _x;
	var _y;

	if(control.enableTouch)
	{
		control.signal = control.dir;
	}

	switch(control.signal)
	{
		case "UP":
		{
			_x = 0;
			_y = -control.fl.move;

			break;
		}

		case "DOWN":
		{
			_x = 0;
			_y = control.fl.move;

			break;
		}

		case "LEFT":
		{
			_x = -control.fl.move;
			_y = 0;

			break;
		}

		case "RIGHT":
		{
			_x = control.fl.move;
			_y = 0;

			break;
		}

		default:
		{
			control.signal = "STILL";
		}
	}

	if(!control.animate && control.signal !== "STILL")
	{
		control.animate = true;

		control.updateXY(_x, _y);

		control_cssAdd();
	}
}



function control_cssAdd()
{
	var css;
	var reset_hitTest = false;


	css = {
					"-webkit-transform" : "translate(" + control.fl.x_target + "px, " + control.fl.y_target + "px)",
					"transform" 				: "translate(" + control.fl.x_target + "px, " + control.fl.y_target + "px)"
				};

	$(".hitTest").css(css);

	hitTest_check();

	if(HIT_TEST.hit_edge)
	{
		reset_hitTest = true;
	}

	else
	{
		control.fl.x_safe = control.fl.x_target;
		control.fl.y_safe = control.fl.y_target;

		$(".player").css(css);
	}

	if(reset_hitTest)
	{
		reset_hitTest = false;

		css = {
						"-webkit-transform" : "translate(" + control.fl.x_safe + "px, " + control.fl.y_safe + "px)",
						"transform" 				: "translate(" + control.fl.x_safe + "px, " + control.fl.y_safe + "px)"
					};

		control.fl.x_target = control.fl.x_safe;
		control.fl.y_target = control.fl.y_safe;

		$(".hitTest").css(css);
		hitTest_init();

		control.animate = false;
	}
}

function control_cssAddEvent(event)
{
	control.fl.x = control.fl.x_target;
	control.fl.y = control.fl.y_target;

	control.animate = false;

	if(control.signal === "UP" || control.signal === "DOWN")
	{
		display_centerLevel();
	}

	control_listen();
}

function hitTest_init()
{
	HIT_TEST = {};

	HIT_TEST.hit_portal_id = "";
	HIT_TEST.hit_enemy_id = "";

	HIT_TEST.hit_edge = false;
	HIT_TEST.hit_portal = false;
	HIT_TEST.hit_enemy = false;
}

function hitTest_check()
{
	HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");

	if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
	{
		if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
		{
			HIT_TEST.hit_edge = true;
		}
	}

}


