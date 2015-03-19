var display;

var Display = function(w, h)
{
	this.gameWidth = w;
	this.gameHeight = h;
}

Display.prototype.init = function()
{
	this.screen_w = window.screen.width;
	this.screen_h = window.screen.height;

	this.w = window.innerWidth;
	this.h = window.innerHeight;

	this.focus_y = 0;
	this.focusCurrent_y = 0;
	this.focusAllow = false;
}

Display.prototype.updateScreenVals = function()
{
	this.w = window.innerWidth;
	this.h = window.innerHeight;
}

Display.prototype.centerPlayer = function()
{
	// 	center_y = -(player_y) + ((screen_h * 0.5) - (player_h * 0.5));
	// this.focus_y = Math.round(-(control.fl.target_safe_y) + ((this.h * 0.5) - (40 * 0.5)));

	this.focus_y = Math.round(-(control.fl.y_safe) + ((this.h * 0.5) - (40 * 0.5)));
}

Display.prototype.hack = function()
{
	this.stageY = {};

	this.stageY.fl = {};

	// VELOCITY
	this.stageY.fl.vy = 0;

	// TARGET Y
	this.stageY.fl.ty = 0;

	// FINAL Y
	this.stageY.fl.dy = 0;

	this.stageY.fl.y = 0;

	this.stageY.fl.move = 40;
	this.stageY.fl.easing = 0.01;
}

function display_init()
{
	display = new Display(320, 2000);
	display.init();

	display.hack();

	display_screenUpdate(true);
}

function display_rotate(event)
{
	if(event != null || event != undefined)
	{
		if(control != null)
		{
			control.touch_setOffset();
		}
	}

	trace(event);
}

function display_screenUpdate(run)
{
	if(run)
	{
		$(window).on("resize", display_screenUpdateEvent);
	}

	else
	{
		$(window).off("resize");
	}
}

function display_screenUpdateEvent(event)
{
	display.updateScreenVals();
	display.centerPlayer();
}

function display_centerLevel()
{
	var css;

	display.centerPlayer();

	if(display.focus_y != display.focusCurrent_y)
	{
		css = {
						"-webkit-transform" : "translateY(" + display.focus_y + "px)",
						"transform" 				: "translateY(" + display.focus_y + "px)"
					};

		$(".tween-screen")[0].addEventListener("webkitTransitionEnd", display_centerLevelEvent, false);
		$(".tween-screen")[0].addEventListener("transitionend", display_centerLevelEvent, false);

		$(".screen").css(css);
	}

}

function display_centerLevelEvent(event)
{
	$(".tween-screen")[0].removeEventListener("webkitTransitionEnd", display_centerLevelEvent, false);
	$(".tween-screen")[0].removeEventListener("transitionend", display_centerLevelEvent, false);

	display.focusCurrent_y = display.focus_y;
}

/*
function display_centerLevel()
{
	var css;

	display.centerPlayer();

	if(display.focus_y != display.focusCurrent_y)
	{
		display.stageY.fl.ty = display.focus_y;

		display.stageY.fl.dy = display.stageY.fl.ty - display.stageY.fl.y;

		if(Math.abs(display.stageY.fl.dy) < 1)
		{
			display.stageY.fl.y = display.stageY.fl.ty;

			display.focusCurrent_y = display.focus_y;
		}

		else
		{
			display.stageY.fl.vy = display.stageY.fl.dy * display.stageY.fl.easing;
			display.stageY.fl.y += display.stageY.fl.vy;
		}

		css = {
						"-webkit-transform" : "translateY(" + display.stageY.fl.y + "px)",
						"transform" 				: "translateY(" + display.stageY.fl.y + "px)"
					};

		$(".screen").css(css);
	}
}
*/


