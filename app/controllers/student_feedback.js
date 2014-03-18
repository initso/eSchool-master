var AppData = require('data'), User = require('User');

function createFeedsRow(teacher, feedback, i) {
	// Create Table Row
	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
//		height : Alloy.Globals.Styles.TableViewRow.height,
		height: '60dp', 
		backgroundColor: '#FFFFFF',
		borderColor: '#D9D9D9',
		borderWidth: 2
	});

	// Create Table Row elements
	var teacherName = Ti.UI.createLabel({
		text: teacher,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: '8dp',
		top: '5dp',
		font: {
			fontSize: '12dp',
			fontWeight: 'bold'
		},
		color: '#77933C'
	});
	var feedback = Ti.UI.createLabel({
		text: feedback,
		top: '24dp',
		height: Ti.UI.SIZE,
		left: '8dp',
		right: '8dp',
		width: Ti.UI.SIZE,
		font: {
			fontSize: 12
		},
		color: '#7F7F7F',
		ellipsize: true
	});

	// Add Columns To Table Row
	tableRow.add(teacherName);
	tableRow.add(feedback);

	// Resource Clean-Up
	teacherName = feedback = null;

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
