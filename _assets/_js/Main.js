var trace = function(msg){ console.log(msg); };

var demo = 1;

var control;

var loopRun;
var loopList;

var HIT_TEST;

var portalTarget;

var enemyTarget;

var portalArr = new Array();

var enemyArr = new Array();

var Control = function()
{
	this.fl = {};
}

Control.prototype.init = function()
{
	this.fl.target_x = 0;
	this.fl.target_y = 0;

	this.fl.target_safe_x = 0;
	this.fl.target_safe_y = 0;

	this.fl.target_move = 40;

	this.fl.x = 0;
	this.fl.y = 0;

	this.fl.spawn_x = 0;
	this.fl.spawn_y = 0;

	this.fl.move = 40;
	this.fl.moveX = 0;
	this.fl.moveY = 0;

	this.signal = false;

	this.dir = "";
}

Control.prototype.writePosition = function(placement)
{
	this.dir 							= placement.d;

	this.fl.x 						= placement.x;
	this.fl.y 						= placement.y;

	this.fl.target_x 			= this.fl.x;
	this.fl.target_y 			= this.fl.y;

	this.fl.target_safe_x = this.fl.x;
	this.fl.target_safe_y = this.fl.y;

	this.fl.moveX 				= 0;
	this.fl.moveY 				= 0;

	this.walkClass				= "tween-player-XX";
}

Control.prototype.writeSpawn = function(placement)
{
	this.fl.spawn_x = placement.x;
	this.fl.spawn_y = placement.y;
}

Control.prototype.walkClassUpdate = function(newClass)
{
	$(".player .player-sprite").removeClass(this.walkClass).addClass(newClass);

	this.walkClass = newClass;
}

Control.prototype.touch_initPad = function(touchArea)
{
	this.touchArea = touchArea;
	this.firstTouch = true;
	this.enableTouch = true;

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

var FakePortal = function(settings)
{
	this.settings = {};
	this.settings = settings;
}

FakePortal.prototype.build = function()
{
	this.id	= this.settings.id;
	this.x 	= this.settings.x;
	this.y 	= this.settings.y;
	this.w 	= this.settings.w;
	this.h 	= this.settings.h;
	this.n	= this.settings.n;
	this.e 	= this.settings.e;
	this.d 	= this.settings.d;

	this.x_mid = this.settings.x + 20;
	this.y_mid = this.settings.y + 20;

	delete this.settings;
}

var FakeEnemy = function(settings)
{
	this.settings = {};
	this.settings = settings;
}

FakeEnemy.prototype.build = function()
{
	this.id	= this.settings.id;
	this.x 	= this.settings.x;
	this.y 	= this.settings.y;
	this.w 	= this.settings.w;
	this.h 	= this.settings.h;
}

$(document).ready(function(){ init(); });


function init()
{
	var p;

	var e;

	display_init();

	control = new Control();
	control.init();

	hitTest_init();

	loopList = new Array();

	loopList.push(onEnterFrame_direction);
	loopList.push(onEnterFrame_stepper);
	loopList.push(hack_hitTest);
	loopList.push(onEnterFrame_move);
	loopList.push(display_centerLevel);

	loopRun = false;

	p = new FakePortal({x:240, y:440, w:80, h:80, n:0, e:1, d:"LEFT", id:"portal_0"});
	p.build();
	portalArr.push(p);

	p = new FakePortal({x:0, y:280, w:80, h:80, n:1, e:2, d:"DOWN", id:"portal_1"});
	p.build();
	portalArr.push(p);

	p = new FakePortal({x:120, y:760, w:80, h:80, n:2, e:1, d:"UP", id:"portal_2"});
	p.build();
	portalArr.push(p);

	e = new FakeEnemy({x:0, y:120, w:40, h:40, id:"enemy_0"});
	e.build();

	enemyArr.push(e);

	onEnterFrame_init(true);

	// TouchUI.js
	touch_init();

	move_init(true);

	$(".status")[0].addEventListener("click", temp_return_toMap, false);
	$(".status")[0].addEventListener("touchend", temp_return_toMap, false);

	// display_centerLevel();

	setBG();
}

function setBG()
{
	var css = {};
	var fill_x = Math.round((display.screen_w * 0.5) / 40) * 40;
	var fill_y = Math.round((display.screen_h * 0.5) / 40) * 40;

	css.l	= {
						"width"							: fill_x + "px",
						"height"						: (display.gameHeight + (fill_y * 2)) + "px",
						"-webkit-transform" : "translate(" + -fill_x + "px, " + -fill_y + "px)",
						"transform" 				: "translate(" + -fill_x + "px, " + -fill_y + "px)"
					};

	css.r	= {
						"width"							: fill_x + "px",
						"height"						: (display.gameHeight + (fill_y * 2)) + "px",
						"-webkit-transform" : "translate(" + display.gameWidth + "px, " + -fill_y + "px)",
						"transform" 				: "translate(" + display.gameWidth + "px, " + -fill_y + "px)"
					};

	css.t	= {
						"height"						: fill_y + "px",
						"-webkit-transform" : "translateY(" + -fill_y + "px)",
						"transform" 				: "translateY(" + -fill_y + "px)"
					};

	css.b	= {
						"height"						: fill_y + "px",
						"-webkit-transform" : "translateY(" + display.gameHeight + "px)",
						"transform" 				: "translateY(" + display.gameHeight + "px)"
					};

	$(".bgFill-l").css(css.l);
	$(".bgFill-r").css(css.r);

	$(".bgFill-t").css(css.t);
	$(".bgFill-b").css(css.b);
}

function onEnterFrame_init(run)
{
	if(run)
	{
		loopRun = true;
		window.requestAnimationFrame(onEnterFrame);
	}

	else
	{
		loopRun = false;
		window.cancelAnimationFrame(onEnterFrame);
	}
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

function move_init(run)
{
	if(run)
	{
		control.signal = true;

		$(window)[0].addEventListener("keydown", move_event, false);
		$(window)[0].addEventListener("keyup", move_event, false);

		// TouchUI.js
		$(window)[0].addEventListener("touchstart", touch_lock, false);

		$("#touchPad-full")[0].addEventListener("touchstart", touch_find, false);
		$("#touchPad-full")[0].addEventListener("touchmove", touch_find, false);
		$("#touchPad-full")[0].addEventListener("touchend", touch_find, false);
	}

	else
	{
		control.signal = false;

		$(window)[0].removeEventListener("keydown", move_event, false);
		$(window)[0].removeEventListener("keyup", move_event, false);

		// TouchUI.js
		$(window)[0].removeEventListener("touchstart", touch_lock, false);

		$("#touchPad-full")[0].removeEventListener("touchstart", touch_find, false);
		$("#touchPad-full")[0].removeEventListener("touchmove", touch_find, false);
		$("#touchPad-full")[0].removeEventListener("touchend", touch_find, false);
	}
}

function move_event(event)
{
	var tempSignal = "";

	if(event.type === "keyup")
	{
		control.dir = "STILL";

		control.walkClassUpdate("tween-player-XX");
	}

	if(event.type === "keydown")
	{
		switch(event.keyCode)
		{
			case 37:
			{
				// LEFT
				tempSignal = "LEFT";

				control.walkClassUpdate("tween-player-LR");

				break;
			}

			case 38:
			{
				// UP
				tempSignal = "UP";

				control.walkClassUpdate("tween-player-UD");

				break;
			}

			case 39:
			{
				// RIGHT
				tempSignal = "RIGHT";

				control.walkClassUpdate("tween-player-LR");

				break;
			}

			case 40:
			{
				// DOWN
				tempSignal = "DOWN";

				control.walkClassUpdate("tween-player-UD");

				break;
			}

			default:
			{
				tempSignal = "STILL";

				control.walkClassUpdate("tween-player-XX");
			}
		}

		if(control.signal)
		{
			control.dir = tempSignal;
		}
	}
}

function move_reset()
{
	hitTest_init();

	control.signal = true;

	onEnterFrame_init(true);
}

function onEnterFrame()
{
	for(var i in loopList)
	{
		loopList[i]();
	}

	if(loopRun)
	{
		window.requestAnimationFrame(onEnterFrame);
	}
}

function onEnterFrame_direction()
{
	if(control.signal)
	{
		if(control.dir === "UP")
		{
			if(control.fl.y == control.fl.target_y)
			{
				control.fl.moveY = -(control.fl.move);
				control.fl.target_y -= control.fl.target_move;
			}
		}

		else if(control.dir === "DOWN") //else if
		{
			if(control.fl.y == control.fl.target_y)
			{
				control.fl.moveY = control.fl.move;
				control.fl.target_y += control.fl.target_move;
			}
		}

		if(control.dir === "LEFT")
		{
			if(control.fl.x == control.fl.target_x)
			{
				control.fl.moveX = -(control.fl.move);
				control.fl.target_x -= control.fl.target_move;
			}
		}

		else if(control.dir === "RIGHT") //else if
		{
			if(control.fl.x == control.fl.target_x)
			{
				control.fl.moveX = control.fl.move;
				control.fl.target_x += control.fl.target_move;
			}
		}
	}

	else
	{

	}
}

function hack_hitTest()
{
	HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");

	if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
	{
		if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
		{
			HIT_TEST.hit_edge = true;

			control.signal = false;
		}

		else if($(HIT_TEST.hits[0]).attr("data-npc") === "portal")
		{
			HIT_TEST.hit_portal = true;

			control.signal = false;

			HIT_TEST.hit_portal_id = HIT_TEST.hits[0].id;
		}

		else if($(HIT_TEST.hits[0]).attr("data-npc") === "enemy")
		{
			HIT_TEST.hit_enemy = true;

			control.signal = false;

			HIT_TEST.hit_enemy_id = HIT_TEST.hits[0].id;
		}
	}

	else
	{

	}

	$(".status p").html(HIT_TEST.hit_edge.toString());

	hack_hitTest_update();
}

function hack_hitTest_update()
{
	if(HIT_TEST.hit_edge)
	{
		// HIT ISSUE SO USE SAFE X & Y (EXTRA WRITE)

		control.fl.target_x = control.fl.target_safe_x;
		control.fl.target_y = control.fl.target_safe_y;

		// RESET CONTROL AND HIT TEST

		// REVERSE LOGIC??

		if(HIT_TEST.hit_edge)
		{
			HIT_TEST.hit_edge = false;
		}

		if(!control.signal)
		{
			control.signal = true;
		}

		// REVERSE LOGIC??
	}

	else
	{
		// SAFE VALUES UPDATED

		if(!HIT_TEST.hit_enemy)
		{
			control.fl.target_safe_x = control.fl.target_x;
			control.fl.target_safe_y = control.fl.target_y;

			// display_centerLevel();
		}
		// control.fl.target_safe_x = control.fl.target_x;
		// control.fl.target_safe_y = control.fl.target_y;
	}

	if(HIT_TEST.hit_portal)
	{
		onEnterFrame_init(false);

		temp_findPortalEnter();
	}

	else
	{

	}

	if(HIT_TEST.hit_enemy)
	{
		onEnterFrame_init(false);



		temp_findEnemy();
	}

	else
	{

	}
}


function onEnterFrame_stepper()
{
	var css;

	var finalMoveX;
	var finalMoveY;

	if(control.signal)
	{
		// USE TARGET X & Y

		finalMoveX = control.fl.target_x;
		finalMoveY = control.fl.target_y;
	}

	else
	{
		// HIT ISSUE SO USE SAFE X & Y

		finalMoveX = control.fl.target_safe_x;
		finalMoveY = control.fl.target_safe_y;
	}

	css = {
					"-webkit-transform"	: "translate(" + finalMoveX + "px, " + finalMoveY + "px)",
					"transform"					: "translate(" + finalMoveX + "px, " + finalMoveY + "px)"
				};

	$(".hitTest").css(css);
}

function onEnterFrame_move()
{
	var css;

	if(!HIT_TEST.hit_portal && !HIT_TEST.hit_enemy)
	{
		if(control.fl.x != control.fl.target_x)
		{
			// ADD NORMAL MOVEMENT
			control.fl.x += control.fl.moveX;
		}

		if(control.fl.y != control.fl.target_y)
		{
			// ADD NORMAL MOVEMENT
			control.fl.y += control.fl.moveY;
		}

		css = {
						"-webkit-transform"	: "translate(" + control.fl.x + "px, " + control.fl.y + "px)",
						"transform"					: "translate(" + control.fl.x + "px, " + control.fl.y + "px)"
					};

		$(".player").css(css);
	}
}

function temp_findEnemy()
{
	for(var i in enemyArr)
	{
		if(HIT_TEST.hit_enemy_id === enemyArr[i].id)
		{
			enemyTarget = enemyArr[i];

			break;
		}
	}

	temp_autoMove_init("ENEMY_ATTACK");
}

function temp_findPortalEnter()
{
	for(var i in portalArr)
	{
		if(HIT_TEST.hit_portal_id === portalArr[i].id)
		{
			portalTarget = portalArr[i];

			break;
		}
	}

	temp_autoMove_init("PORTAL_ENTER");
}

function temp_findPortalExit()
{
	for(var i in portalArr)
	{
		if(portalTarget.e == portalArr[i].n)
		{
			portalTarget = portalArr[i];

			break;
		}
	}

	temp_autoMove_init("PORTAL_PLACE");
}

function temp_autoMove_init(moveRequest)
{
	var tween;
	var css;
	var temp_delay;

	var moveTypes = {

		"PORTAL_ENTER"	: function()
		{
			tween = {};

			tween.x 		= portalTarget.x_mid;
			tween.y 		= portalTarget.y_mid;
			tween.a 		= "0";
			tween.onEnd = temp_autoMove_event_enter;

			control.walkClassUpdate("tween-player-XX");

			temp_autoMove_tween(tween, true);

			delete tween;
		},

		"PORTAL_PLACE"	: function()
		{
			tween = {};

			tween.x 		= portalTarget.x_mid;
			tween.y 		= portalTarget.y_mid;
			tween.a 		= "0";

			control.writePosition({x:tween.x, y:tween.y, d:"STILL"});

			// display_centerLevel();

			temp_autoMove_tween(tween, false);

			delete tween;

			// HACKY EXIT AFTER SCREEN PLACEMENT

			temp_delay = setTimeout(temp_autoMove_init, 600, "PORTAL_EXIT");

		},

		"PORTAL_EXIT"		: function()
		{
			tween = {};
			css;

			// tween.x 				= portalTarget.x_mid;
			// tween.y 				= portalTarget.y_mid;
			tween.x 				= portalTarget.x;
			tween.y 				= portalTarget.y;
			tween.a 				= "1";
			tween.pushX 		= 0;
			tween.pushY 		= 0;
			tween.onEnd 		= temp_autoMove_event_exit;

			switch(portalTarget.d)
			{
				case "UP"			:{ tween.pushY = -(portalTarget.h); break; }
				case "DOWN"		:{ tween.pushY = portalTarget.h * 1.5; 		break; }
				case "LEFT"		:{ tween.pushX = -(portalTarget.w); break; }
				case "RIGHT"	:{ tween.pushX = portalTarget.w * 1.5; 		break; }
			}

			tween.x += tween.pushX;
			tween.y += tween.pushY;

			css = 	{
								"-webkit-transform"	: "translate(" + tween.x + "px, " + tween.y + "px)",
								"transform"					: "translate(" + tween.x + "px, " + tween.y + "px)"
							};

			$(".hitTest").css(css);

			control.writePosition({x:tween.x, y:tween.y, d:"STILL"});

			temp_autoMove_tween(tween, true);

			delete tween;
		},

		"ENEMY_ATTACK"	: function()
		{
			tween = {};

			tween.x 		= enemyTarget.x;
			tween.y 		= enemyTarget.y;
			tween.a 		= "1";
			tween.onEnd = temp_autoMove_enemyAttack;

			control.walkClassUpdate("tween-player-XX");

			temp_autoMove_tween(tween, true);

			delete tween;
		},

		"ENEMY_RETREAT"	: function()
		{
			tween = {};

			tween.x 		= control.fl.target_safe_x;
			tween.y 		= control.fl.target_safe_y;

			control.writePosition({x:tween.x, y:tween.y, d:"STILL"});

			temp_autoMove_tween(tween, false);

			delete tween;
		},

		"SPAWN"	: function()
		{
			tween = {};

			tween.x	= control.fl.spawn_x;
			tween.y	= control.fl.spawn_y;

			control.writePosition({x:tween.x, y:tween.y, d:"STILL"});

			control.walkClassUpdate("tween-player-XX");

			temp_autoMove_tween(tween, false);

			delete tween;
		},

		"SPAWN_MOVE"	: function()
		{
			tween = {};

			delete tween;
		}

	};

	if(typeof moveTypes[moveRequest] === "function")
	{
		return moveTypes[moveRequest]();
	}
}

function temp_autoMove_tween(settings, animate)
{
	var css = settings;

	if(animate)
	{
			$(".player").addClass("tween-player");

			$(".tween-player")[0].addEventListener("webkitTransitionEnd", css.onEnd, false);
			$(".tween-player")[0].addEventListener("transitionend", css.onEnd, false);
	}

	css.write = 	{
										"-webkit-transform"	: "translate(" + css.x + "px, " + css.y + "px)",
										"transform"					: "translate(" + css.x + "px, " + css.y + "px)"
								};

	$(".player").css(css.write);

	if(css.a)
	{
		$(".player").css("opacity", css.a);
	}
}

function temp_autoMove_event_enter(event)
{
	$(".player")[0].removeEventListener("webkitTransitionEnd", temp_autoMove_event_enter, false);
	$(".player")[0].removeEventListener("transitionend", temp_autoMove_event_enter, false);

	$(".player").removeClass("tween-player");

	temp_findPortalExit();
}

function temp_autoMove_event_exit(event)
{
	$(".player")[0].removeEventListener("webkitTransitionEnd", temp_autoMove_event_exit, false);
	$(".player")[0].removeEventListener("transitionend", temp_autoMove_event_exit, false);

	$(".player").removeClass("tween-player");

	control.writeSpawn({x:control.fl.x, y:control.fl.y});

	// PLUG CONTROLS
	move_reset();
}

function temp_autoMove_enemyAttack()
{
	$(".player")[0].removeEventListener("webkitTransitionEnd", temp_autoMove_enemyAttack, false);
	$(".player")[0].removeEventListener("transitionend", temp_autoMove_enemyAttack, false);

	$(".player").removeClass("tween-player");
}

// HACK

function temp_return_toMap(event)
{
	if(demo == 0)
	{
		temp_autoMove_init("ENEMY_RETREAT");

		// PLUG CONTROLS
		move_reset();
	}

	if(demo == 1)
	{
		temp_autoMove_init("SPAWN");

		// PLUG CONTROLS
		move_reset();
	}
}




