//Tabs are 20% of screen width for handheld
var platformWidth = Titanium.Platform.displayCaps.platformWidth;
var dpi=Titanium.Platform.displayCaps.dpi;
var tabWidth= (platformWidth*160)/(4*dpi);

var tabPositions = {
	home:0,
	agenda:tabWidth,
	feedback:tabWidth*2,
	evaluation:tabWidth*3
};

//set tab positions
$.home.left = tabPositions.home;
$.agenda.left = tabPositions.agenda;
$.feedback.left = tabPositions.feedback;
$.evaluation.left = tabPositions.evaluation;

//add tab behavior
function doTab(name,offset,noEvent) {
	_.each(['home', 'agenda', 'feedback', 'evaluation'], function(item) {
			if (name === item) {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-pressed.png';
			}
			else {
				console.log(item);
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-default.png';
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


$.feedback.on('click', function() {
	doTab('feedback', tabPositions.feedback);
});

$.evaluation.on('click', function() {
	doTab('evaluation', tabPositions.evaluation);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


