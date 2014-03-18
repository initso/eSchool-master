var args = arguments[0] || {};
var AppData = require('data'), User = require('User');

Ti.App.addEventListener('feedbackUpdated', function(e) {
	console.log("hi");
	console.log("hi");
	console.log("hi");
	
	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.tableFeeds.data)) {
		$.tableFeeds.data = [];
	}
	
	AppData.getFeedback("Feedback", AppData.getUserName(), function(feedback) {
		var recordData = [];
		for (var i = 0; i < feedback.length; i++) {
			var record = feedback[i];
			console.log(feedback[i]);
			// This doesn't need to be a row, it could just be an object
			// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
			recordData.push(createFeedsRow(record.teacher, record.feedback, i));
		}
		// Set the table data in one go rather than making repeated (costlier) calls on the loop
		$.tableFeeds.setData([]);
		$.tableFeeds.setData(recordData);
	});
});



//Table Generator
function createRow(first_name, last_name, user_name, i) {
	// Create Table Row

	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
		height : Alloy.Globals.Styles.TableViewRow.height,

	});
	// Create Table Row Columns
	var fname = Ti.UI.createView({
		left : 0,
		width : "35%",
		height : Ti.UI.Size
	});
	var lname = Ti.UI.createView({
		left : "35%",
		width : "35%",
		height : Ti.UI.Size
	});
	var username = Ti.UI.createView({
		left : "70%",
		width : "30%",
		height : Ti.UI.Size
	});

	// Create Table Row Column Labels
	fname.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : first_name,
		color : '#000'
	}));
	lname.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : last_name,
		color : '#000'
	}));
	username.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : user_name,
		color : '#000'
	}));

	// Add Columns To Table Row
	tableRow.add(fname);
	tableRow.add(lname);
	tableRow.add(username);

	// Resource Clean-Up
	fname = lname = username = null;

	// Finished
	return tableRow;

}

function createFeedsRow(teacher, feedback, i) {
	// Create Table Row
	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
		height : Alloy.Globals.Styles.TableViewRow.height,

	});

	// Create Table Row Columns
	var teacherName = Ti.UI.createView({
		left : 0,
		width : "40%",
		height : Ti.UI.Size
	});
	var feedback = Ti.UI.createView({
		left : "40%",
		width : "60%",
		height : Ti.UI.Size
	});

	// Create Table Row Column Labels
	teacherName.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : teacher,
		color : '#000'
	}));
	feedback.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : feedback,
		color : '#000'
	}));

	// Add Columns To Table Row
	tableRow.add(teacherName);
	tableRow.add(feedback);

	// Resource Clean-Up
	teacherName = feedback = null;

	// Finished
	return tableRow;

}

//Example class selected is IXA.
function actionDropdown(e) {
	var classStack = ["IXA"];
	var opts = {
		cancel : 2,
		options : classStack,
		selectedIndex : 0,
		destructive : 0,
		title : 'Select Class Room'
	};

	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	dialog.addEventListener("click", function(e) {
		dialog.hide();
		console.log(classStack[e.index]);
		if (! _.isEmpty($.studentListTable.data)) {
			$.studentListTable.data = [];
		}
		User.searchStudents(classStack[e.index], "Student", function(students) {
			var recordData = [];
			for (var i = 0; i < students.length; i++) {
				var record = students[i];
				console.log(students[i]);
				// This doesn't need to be a row, it could just be an object
				// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
				recordData.push(createRow(record.username, record.first_name, record.last_name, i));
			}
			// Set the table data in one go rather than making repeated (costlier) calls on the loop
			$.studentListTable.setData([]);
			$.studentListTable.setData(recordData);
			$.studentListTable.addEventListener('click', selectedStudent);
		});
	});
}

function selectedStudent(e) {
	var dataId = e.rowData.dataId;

	var w = Alloy.createController('postWindow', {
		dataId : dataId,
		parentTab : "Feedback"
	});
	w.openWindow();
	$.teacherFeedbackWin.close();
}

if (AppData.getUserType() == "Teacher") {
	$.teacherFeedbackWin.open({
		modal : true
	});
	$.studentFeedbackWin.close();
	console.log("y is it here?");

} else {
	console.log("y not here?");
	Ti.App.fireEvent('feedbackUpdated');
}
