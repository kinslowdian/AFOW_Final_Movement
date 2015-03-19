function touch_init()
{
	control.touch_initPad("touchPad-full");
}

function touch_lock(event)
{
	event.preventDefault();
}

function touch_find(event)
{
	event.preventDefault();

	if(event.type === "touchstart" || event.type === "touchmove")
	{
		if(!control.touchData.offset)
		{
			control.touch_setOffset();
		}

		if(!control.enableTouch)
		{
			control.enableTouch = true;
		}

		control.touchData.x = event.targetTouches[0].pageX - control.touchData.offset.left;
		control.touchData.y = event.targetTouches[0].pageY - control.touchData.offset.top;

		if(control.touchData.x >= 0 && control.touchData.x <= control.touchData.x_measure)
		{
			control.touchData.x_percent = Math.round((control.touchData.x / control.touchData.x_measure) * 100);
		}

		if(control.touchData.y >= 0 && control.touchData.y <= control.touchData.y_measure)
		{
			control.touchData.y_percent = Math.round((control.touchData.y / control.touchData.y_measure) * 100);
		}

		touch_controlSignal();
	}

	if(event.type === "touchend")
	{
		control.touch_reset();

		touch_feedback();
	}
}

function touch_controlSignal()
{
	if(control.touchData.x_percent >= 33 && control.touchData.x_percent < 66)
	{
		if(control.touchData.y_percent >= 0 && control.touchData.y_percent < 33)
		{
			control.dir = "UP";
		}
	}

	if(control.touchData.x_percent >= 33 && control.touchData.x_percent < 66)
	{
		if(control.touchData.y_percent >= 66 && control.touchData.y_percent <= 100)
		{
			control.dir = "DOWN";
		}
	}

	if(control.touchData.x_percent >= 0 && control.touchData.x_percent < 33)
	{
		if(control.touchData.y_percent >= 33 && control.touchData.y_percent < 66)
		{
			control.dir = "LEFT";
		}
	}

	if(control.touchData.x_percent >= 66 && control.touchData.x_percent <= 100)
	{
		if(control.touchData.y_percent >= 33 && control.touchData.y_percent < 66)
		{
			control.dir = "RIGHT";
		}
	}

	touch_feedback();
}

function touch_feedback()
{
	var ind;

	var walkClass;

	switch(control.dir)
	{
		case "UP":
		{
			ind = "touchPad-U-ind";
			walkClass = "tween-player-UD";

			break;
		}

		case "DOWN":
		{
			ind = "touchPad-D-ind";
			walkClass = "tween-player-UD";

			break;
		}

		case "LEFT":
		{
			ind = "touchPad-L-ind";
			walkClass = "tween-player-LR";

			break;
		}

		case "RIGHT":
		{
			ind = "touchPad-R-ind";
			walkClass = "tween-player-LR";

			break;
		}
	}

	if(control.dir === "STILL")
	{
		$("#" + control.touchData.indicator).removeClass("touchPad_C_signal_show").addClass("touchPad_C_signal_hide");

		control.touchData.indicator = "";

		control.walkClassUpdate("tween-player-XX");
	}

	else
	{
		if(ind !== control.touchData.indicator)
		{
			$("#" + control.touchData.indicator).removeClass("touchPad_C_signal_show").addClass("touchPad_C_signal_hide");

			$("#" + ind).removeClass("touchPad_C_signal_hide").addClass("touchPad_C_signal_show");

			control.touchData.indicator = ind;

			control.walkClassUpdate(walkClass);
		}
	}

	control_listen();
}



// ADDED




