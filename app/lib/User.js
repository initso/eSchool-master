//dependencies
var Cloud = require('ti.cloud'),
	Gravitas = require('gravitas');
	
//Empty constructor (for now)
function User() {}

/*
 * Static model functions
 */


//
// Login stuff
//
var loggedIn = false;
var userName = '';
var userType = '';

// Check for persisted login
if (Ti.App.Properties.getString('loggedIn')) {
	loggedIn = true;
}

if (Ti.App.Properties.getString('userName')) {
	userName = Ti.App.Properties.getString('userName');
}

if (Ti.App.Properties.getString('userType')) {
	userType = Ti.App.Properties.getString('userType');
}


//Check for a current login session ID - if we have one, configure cloud, if not, return false
User.confirmLogin = function() {
	auth=false;
	if (Ti.App.Properties.hasProperty('sessionId')) {
		//set up cloud module to use saved session
		Cloud.sessionId = Ti.App.Properties.getString('sessionId');
		auth = true;
	}
	return auth;
};


//Log in an Appcelerator network user
User.login = function(username, password, callback, error) {
	Cloud.Users.login({
		login : username,
		password : password
	}, function(e) {
		if (e.success) {
			var user = e.users[0];
			//Set User name and type for future in your local Data
			AppData.userName = user.username;
			AppData.userType = user.custom_fields.type;
			AppData.loggedIn = true;
			Ti.App.Properties.setString('loggedIn', 1);
			Ti.App.Properties.setString('userName', user.username);
			Ti.App.Properties.setString('userType', user.custom_fields.type);
			Ti.App.Properties.setString('sessionId', Cloud.sessionId);
			callback({
				result : 'ok'
			});
		} else {
			error((e.error && e.message) || JSON.stringify(e));
		}
	});
};

//Log out the current user
User.logout = function(callback) {
	loggedIn = false;
	Ti.App.Properties.removeProperty('loggedIn');
	Ti.App.Properties.removeProperty('userName');
	Ti.App.Properties.removeProperty('userType');
	Ti.App.Properties.removeProperty('sessionId');
	callback({
		result : 'ok'
	});
};

//Assign the given photo as the profile photo for the current user
User.assignProfilePhoto = function(blob, cb) {
	Cloud.Users.update({
		photo:blob
	}, function(e) {
		var usr = e.users[0];
		if (e.success) {
			//Now, grab the profile image URL...
			Cloud.Users.showMe(function(ev) {
				if (ev.success) {
					var me = ev.users[0];
					Ti.App.Properties.setString('profileImage', me.photo.urls.square_75);
				}
				cb(e);
			});
			cb(e);
		}
		cb(e);
	});
};

//Retrieve user network details
User.getUserDetails = function() {
	return Ti.App.Properties.getString('userName');
};


//Generate an avatar image associated with this user
User.generateAvatarURL = function() {
	//prefer stored property
	if (Ti.App.Properties.hasProperty('profileImage')) {
		return Ti.App.Properties.getString('profileImage');
	}
	
	//Fallback to Gravatar URL
	var deets = User.getUserDetails();
	return Gravitas.createGravatar({
		email:deets,
		size:44
	});
};


//Export constructor function as public interface
module.exports = User;
