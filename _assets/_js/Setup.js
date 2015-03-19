var trace = function(msg){ console.log(msg); };

var demo = 1;

var HIT_TEST;

var portalTarget;

var enemyTarget;

var portalArr = new Array();

var enemyArr = new Array();

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


function init()
{
	var p;

	var e;

	display_init();

	// control = new Control();
	// control.init();

	// hitTest_init();

	// loopList = new Array();

	// loopList.push(onEnterFrame_direction);
	// loopList.push(onEnterFrame_stepper);
	// loopList.push(hack_hitTest);
	// loopList.push(onEnterFrame_move);
	// loopList.push(display_centerLevel);

	// loopRun = false;

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

	// onEnterFrame_init(true);

	// TouchUI.js
	// touch_init();

	// move_init(true);

	// $(".status")[0].addEventListener("click", temp_return_toMap, false);
	// $(".status")[0].addEventListener("touchend", temp_return_toMap, false);

	// display_centerLevel();

	setBG();

	control_init();

	// START CONTROLS
	control_run(true);
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