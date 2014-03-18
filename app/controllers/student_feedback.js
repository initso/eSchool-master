var AppData = require('data'), User = require('User');

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
	var feedbackView = Ti.UI.createView({
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
	feedbackView.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : feedback,
		color : '#000'
	}));

	// Add Columns To Table Row
	tableRow.add(teacherName);
	tableRow.add(feedbackView);

	// Resource Clean-Up
	teacherName = feedbackView = null;

	// Finished
	return tableRow;

}


Ti.App.addEventListener('feedbackUpdated', function(e) {

	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.tableFeeds.data)) {
		$.tableFeeds.data = [];
	}
	
	AppData.getFeedback(AppData.getUserName(), "Feedback", function(feedback) {
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


Ti.App.fireEvent('feedbackUpdated');
