var Cloud = require('ti.cloud');

//DateStamp generator to store lecture details
function dateStampGen() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	//January is 0!
	var yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}

	today = yyyy + '-' + mm + '-' + dd + "T00:00:00+0000";
	return today;
}

//Todays Day for the Schedule
function gettDay() {
	var currentTime = new Date();
	var daytoday = currentTime.getDay();
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	return weekday[daytoday];
}

//TODO: Persistent Login
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

exports.isLoggedIn = function() {
	return loggedIn;
};

exports.login = function(username, password, callback) {
	var Cloud = require('ti.cloud');

	Cloud.Users.login({
		login : username,
		password : password
	}, function(e) {
		if (e.success) {
			var user = e.users[0];

			console.log(user.username);
			console.log(user.custom_fields.type);
			//Set User name and type for future in your local Data
			userName = user.username;
			userType = user.custom_fields.type;
			loggedIn = true;
			Ti.App.Properties.setString('loggedIn', 1);
			Ti.App.Properties.setString('userName', user.username);
			Ti.App.Properties.setString('userType', user.custom_fields.type);

			callback({
				result : 'ok'
			});
		} else {
			callback((e.error && e.message) || JSON.stringify(e));
		}
	});
};

exports.logout = function(callback) {
	loggedIn = false;
	Ti.App.Properties.removeProperty('loggedIn');
	callback({
		result : 'ok'
	});
};

//
// App data and methods
//
var today = gettDay();
var dataStore = [];
var dateStamp = dateStampGen();
var teacherSchedule = [];
var summary = [];
var summary_id = '';
var teachesAt = ["IXA"];
var className = '';


exports.getToday=function(){
	return dateStamp;
};


//TODO: Build this Datastore from the cloud

//GET todays Schedule normal for Teachers
function Schedule(user, type, teachesAt, callback) {
	for (var k = 0; k < teachesAt.length; k++) {
		className = teachesAt[k];
		console.log(className);
		Cloud.Objects.query({
			classname : className,
			page : 1,
			per_page : 10,
			where : {
				"Day" : {
					"$regex" : today
				}
			}
		}, function(e) {
			if (e.success) {
				console.log("Hello World");
				for (var i = 0; i < e[className].length; i++) {
					var timetable = e[className][i];
					console.log(timetable);
					dataStore = timetable.Timetable;
				}
				for (var j = 0; j < dataStore.length; j++) {
					if (dataStore[j].teacher == user) {
						var time = dataStore[j].time;
						console.log(time);
						teacherSchedule.push(dataStore[j]);
					}
				}
				console.log("In loop:" + teacherSchedule);
				callback();
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	}
}

//GET Lecture Summary
function lectSummary(teachesAt, callback) {
	className = teachesAt + "pastLectures";
	console.log(className);
	Cloud.Objects.query({
		classname : className,
		page : 1,
		per_page : 10,
		where : {
			"DateStamp" : dateStamp
		}
	}, function(e) {
		if (e.success) {
			console.log("Hello World");
			for (var i = 0; i < e[className].length; i++) {
				var timetable = e[className][i];
				summary = timetable.lecSummary;
				summary_id = timetable.id;
			}
			callback();
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

//Get Id from Lecture Summary for this date
//Insert Lecture Summary from Todays Schedule
function updateDetails(teachesAt, dateStamp, updatedSummary) {
	className = teachesAt + "pastLectures";
	lectSummary(teachesAt, function() {
		console.log("This is the summary:"+summary);
		summary.push(updatedSummary[0]);
		console.log(summary);
		Cloud.Objects.update({
			classname : className,
			id : summary_id,
			fields : {
				lecSummary : summary
			}
		}, function(e) {
			if (e.success) {
				var showSummary = e[className][0];
				Ti.App.fireEvent('summaryUpdated');
				alert('Successful Updated your Lecture Details');
			} else {
				createLectSummary(teachesAt, dateStamp, updatedSummary);
				//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});

	});
}

function createLectSummary(teachesAt, dateStamp, updatedSummary){
	Cloud.Objects.create({
    classname: className,
    fields: {
		DateStamp: dateStamp,
		lecSummary : updatedSummary
    }
}, function (e) {
    if (e.success) {
		Ti.App.fireEvent('summaryUpdated');
        alert('Successful!');
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
}


// Delete
exports.deleteItem = function(id) {
	dataStore.splice(id, 1);
};

//Update
exports.updateSummary = function(className, dateStamp, summary) {
	updateDetails(className, dateStamp, summary);
};

// Get
exports.getItem = function(id) {
	return dataStore[id];
};

//Get Summary of Lectures for a day
exports.getSummary = function(callback) {
	lectSummary("IXA", function() {
		console.log("reTurning:" + summary);
		callback(summary);
	});
};

// GetAll
exports.getAll = function(callback) {
	console.log(getUser());
	if (getType() == "Student") {
		Schedule(getUser(), getType(), ["IXA"], function() {
			console.log("reTurning:" + dataStore);
			callback(dataStore);
		});
	} else if (getType() == "teacher") {
		Schedule(getUser(), getType(), ["IXA"], function() {
			console.log("reTurning:" + teacherSchedule);
			console.log("out loop:" + teacherSchedule);
			callback(teacherSchedule);
		});
	}
};

//Get Teacher Schedule
exports.getTeacherSchedule = function() {
	//console.log(userName);
	Schedule(userName, userType, ["IXA"], function() {
		console.log("reTurning:" + teacherSchedule);
		return teacherSchedule;
	});
};

function getUser(){
	return Ti.App.Properties.getString('userName');
}

function getType(){
	return Ti.App.Properties.getString('userType');
}

exports.getUserName = function() {
	return userName;
};

exports.getUserType = function() {
	return userType;
};
