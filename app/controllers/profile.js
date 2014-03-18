var User = require('User'),
	ui = require('ui');
	
var userDetails = User.getUserDetails();

//Set up loading screen
$.loading = Alloy.createController('loading');

$.name.text = 'Hemant Sir';
$.email.text = userDetails;
$.org.text = 'St Johns';
$.title.text = 'Teacher';


//Attempt to grab and use the current profile image
$.avatar.image = User.generateAvatarURL();

$.logout.on('click', function() {
	$.loading.start();
	$.index.add($.loading.getView());
	User.logout(function(e) {
		$.loading.stop();
		$.index.remove($.loading.getView());
		if (e.success) {
			Ti.App.fireEvent('app:logout');
		}
		else {
			ui.alert('logoutError', 'logoutErrorText');
		}
	});
});

//Handle image attachment
$.avatar.on('click', function() {
	//TODO: Support image attachment - partially implemented, needs more testing for production.
		
	var od = Ti.UI.createOptionDialog({
		options:['Go', L('cancel')],
		cancel:1,
		title:L('gravatar')
	});
	od.addEventListener('click', function(e) {
		if (e.index === 0) {
			Ti.Platform.openURL('http://gravatar.com');
		}
	});
	od.show();

});




