//Tabs are 20% of screen width for handheld
var platformWidth = Titanium.Platform.displayCaps.platformWidth;
var dpi=Titanium.Platform.displayCaps.dpi;
var tabWidth= (platformWidth*160)/(5*dpi);


var tabPositions = {
	home:0,
	agenda:tabWidth,
	post:tabWidth*2,
	feedback:tabWidth*3,
	venue:tabWidth*4
};

//set tab positions
$.home.left = tabPositions.home;
$.agenda.left = tabPositions.agenda;
$.post.left = tabPositions.post;
$.feedback.left = tabPositions.feedback;
$.venue.left = tabPositions.venue;

//add tab behavior
function doTab(name,offset,noEvent) {
	_.each(['home', 'agenda', 'post', 'feedback', 'venue'], function(item) {
		if (item !== 'post') {
			if (name === item) {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-pressed.png';
			}
			else {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-default.png';
			}
		}
	});
	
	noEvent || ($.trigger('change',{
		name:name
	}));
}

$.home.on('click', function() {
	doTab('home', tabPositions.home);
});

$.agenda.on('click', function() {
	doTab('agenda', tabPositions.agenda);
});

//post is special, just fire event
$.postIcon.on('click', function() {
	$.trigger('change', {
		name:'post'
	});
});

$.feedback.on('click', function() {
	doTab('feedback', tabPositions.feedback);
});

$.venue.on('click', function() {
	doTab('venue', tabPositions.venue);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


