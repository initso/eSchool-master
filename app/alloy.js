// Anwdroid api version
if (OS_ANDROID) {
	Alloy.Globals.Android = {
		'Api' : Ti.Platform.Android.API_LEVEL
	};
}

// Styles
Alloy.Globals.Styles = {
	'TableViewRow' : {
		'height' : 45
	}
};

var tt = {};
tt.ui = {};

//create a film strip like view
tt.ui.createFilmStripView = function(_args) {
	var root = Ti.UI.createView(tt.combine($$.stretch, _args));
	views = _args.views;
	container = Ti.UI.createView({
		top : 0,
		left : 0,
		bottom : 0,
		width : $$.platformWidth * _args.views.length
	});

	for (var i = 0, l = views.length; i < l; i++) {
		var newView = Ti.UI.createView({
			top : 0,
			bottom : 0,
			left : $$.platformWidth * i,
			width : $$.platformWidth
		});
		newView.add(views[i]);
		container.add(newView);
	}
	root.add(container);

	//set the currently visible index
	root.addEventListener('changeIndex', function(e) {
		var leftValue = $$.platformWidth * e.idx * -1;
		container.animate({
			duration : $$.animationDuration,
			left : leftValue
		});
	});

	return root;
};

tt.combine = function(/*Object*/obj, /*Object...*/props) {
	var newObj = {};
	for (var i = 0, l = arguments.length; i < l; i++) {
		mixin(newObj, arguments[i]);
	}
	return newObj;
};

var empty = {};
function mixin(/*Object*/target, /*Object*/source) {
	var name, s, i;
	for (name in source) {
		s = source[name];
		if (!( name in target) || (target[name] !== s && (!( name in empty) || empty[name] !== s))) {
			target[name] = s;
		}
	}
	return target;
	// Object
};

//Globally available theme object to hold theme colors/constants
tt.ui.theme = {
	textColor : '#000000',
	grayTextColor : '#888888',
	headerColor : '#333333',
	lightBlue : '#006cb1',
	darkBlue : '#93caed',

};

//All shared property sets are declared here.
tt.ui.properties = {
	//grab platform dimensions only once to save a trip over the bridge
	platformWidth : Ti.Platform.displayCaps.platformWidth,
	platformHeight : Ti.Platform.displayCaps.platformHeight,

	//we use these as JS-based 'style classes'
	animationDuration : 500,
	stretch : {
		top : 0,
		bottom : 0,
		left : 0,
		right : 0
	},
	spacerRow : {
		backgroundImage : 'images/spacer_row.png',
		height : 30,
		className : 'spacerRow'
	},
	Window : {
		backgroundImage : 'images/ruff.png',
		navBarHidden : true,
		softInputMode : (Ti.UI.Android) ? Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE : ''
	}
};

tt.combine = function(/*Object*/obj, /*Object...*/props) {
	var newObj = {};
	for (var i = 0, l = arguments.length; i < l; i++) {
		mixin(newObj, arguments[i]);
	}
	return newObj;
};

//global shortcut for UI properties, since these get used A LOT. polluting the global
//namespace, but for a good cause (saving keystrokes)
var $$ = tt.ui.properties;
