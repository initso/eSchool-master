var Cloud = require('ti.cloud');

//DateStamp generator to store lecture details
function dateStampGen(today) {
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	//January is 0!
	var month=new Array();
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";
	
	var yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

//	if (mm < 10) {
//		mm = '0' + mm;
//	}

	//today = yyyy + '-' + mm + '-' + dd + "T00:00:00+0000";
	today = month[today.getMonth()] + ' ' + dd + "";
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



//
// App data and methods
//
var today = gettDay();
var dataStore = [];
var dateStamp = dateStampGen(new Date());
var teacherSchedule = [];
var summary = [];
var feedback = [];
var summary_id = '';
var feedback_id='';
var teachesAt = ["IXA"];
var className = '';


exports.getToday=function(date){
	return dateStampGen(date);
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
function lectSummary(teachesAt, dateStamp, callback) {
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


function Feedback(userName, className, callback){
	console.log(userName);
	console.log(className);
	
	Cloud.Objects.query({
		classname : className,
		page : 1,
		per_page : 10,
		where : {
			"username" : userName
		}
	}, function(e) {
		if (e.success) {
			console.log("Hello World");
			console.log(e);
			for (var i = 0; i < e[className].length; i++) {
				var timetable = e[className][i];
				console.log(timetable);
				feedback = timetable.feedback;
				console.log(feedback);
				feedback_id=timetable.id;
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
	lectSummary(teachesAt, dateStamp, function() {
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

//Get Id from Lecture Summary for this date
//Insert Lecture Summary from Todays Schedule
function updateFeedback(className, userName, updatedFeedback) {
	Feedback(userName, className, function() {
		console.log("This is the summary:"+feedback);
		feedback.push(updatedFeedback[0]);
		console.log(feedback);
		Cloud.Objects.update({
			classname : className,
			id : feedback_id,
			fields : {
				feedback : feedback
			}
		}, function(e) {
			if (e.success) {
				alert('Successful submitted the feedback');
			} else {
				createFeedback(className, userName, updatedFeedback);
				//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});

	});
}

function createFeedback(className, userName, updatedFeedback){
	Cloud.Objects.create({
    classname: className,
    fields: {
		username: userName,
		feedback : updatedFeedback
    }
}, function (e) {
    if (e.success) {
        alert('Successful!');
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
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

exports.sendFeedback= function(className, userName, feedback){
	updateFeedback(className, userName, feedback);
};

// Get
exports.getItem = function(id) {
	return dataStore[id];
};

//Get Summary of Lectures for a day
exports.getSummary = function(className, dateStamp,callback) {
	lectSummary(className, dateStamp, function() {
		console.log("reTurning:" + summary);
		callback(summary);
	});
};

exports.getFeedback = function(userName,className, callback) {
	Feedback(userName, className, function() {
		console.log("reTurning:" + feedback);
		callback(feedback);
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
	return Ti.App.Properties.getString('userName');
};

exports.getUserType = function() {
	return Ti.App.Properties.getString('userType');
};
