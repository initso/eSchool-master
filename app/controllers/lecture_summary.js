//
// Check for expected controller args
//
var args = arguments[0] || {};
var parentTab = args.parentTab || '';

//Table Generator
function createRow(subject, teacher, description, alerts, i) {
	// Create Table Row

	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
		height : Alloy.Globals.Styles.TableViewRow.height,
	});
	var tabBackRow = Ti.UI.createView();

	var tabRow = Ti.UI.createView({
		classes : 'tableRow'
	});
	var view1 = Ti.UI.createView();

	var style = $.createStyle({
		classes : 'subject'
	});

	var subjectLabel = Ti.UI.createLabel({
		text : subject,
		classes : 'subject'
	});

	subjectLabel.applyProperties(style);

	view1.add(subjectLabel);

	if (alerts) {
		var style1 = $.createStyle({
			classes : 'rightImage'
		});

		var rightImage = Ti.UI.createImageView();
		rightImage.applyProperties(style1);

		view1.add(rightImage);
	}

	var stylelecture = $.createStyle({
		classes : 'lectureDetail'
	});

	var lectureDetail = Ti.UI.createView();
	lectureDetail.applyProperties(stylelecture);

	var style2 = $.createStyle({
		classes : 'teacher'
	});

	var teacherLabel = Ti.UI.createLabel({
		text : teacher
	});
	teacherLabel.applyProperties(style2);

	var style4 = $.createStyle({
		classes : 'description',
		id : 'description1'
	});

	var description1Label = Ti.UI.createLabel({
		text : description
	});
	description1Label.applyProperties(style4);

	lectureDetail.add(teacherLabel);
	lectureDetail.add(description1Label);

	var style5 = $.createStyle({
		classes : 'description',
		id : 'description2'
	});

	var description2Label = Ti.UI.createLabel({
		text : "cycle or the H2O cycle, describes the continuous movement of water on, above and below the surface of the Earth."
	});

	description2Label.applyProperties(style5);

	tabRow.add(view1);
	tabRow.add(lectureDetail);
	tabRow.add(description2Label);

	tabBackRow.add(tabRow);
	tableRow.add(tabBackRow);

	console.log(i);
	// Resource Clean-Up

	// Finished
	return tableRow;
}

Ti.App.addEventListener('summaryUpdated', function(e) {
	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.table.data)) {
		$.table.data = [];
		// $.table.removeEventListener('click', tableClick);
		// $.table.removeEventListener('longpress', tableLongPress);
	}
	var AppData = require('data');
	AppData.getSummary(function(dataStore) {

		var recordData = [];
		for (var i = 0; i < dataStore.length; i++) {
			var record = dataStore[i];
			console.log(dataStore[i]);
			// This doesn't need to be a row, it could just be an object
			// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
			recordData.push(createRow(record.title, record.teacher, record.description, record.homework, i));
		}
		// Set the table data in one go rather than making repeated (costlier) calls on the loop
		$.table.setData([]);
		$.table.setData(recordData);

	});
});

Ti.App.fireEvent('summaryUpdated');

// Android
if (OS_ANDROID) {
	$.lecture_summary.addEventListener('open', function() {

		if ($.lecture_summary.activity) {
			var activity = $.lecture_summary.activity;
			// Action Bar
			if (Ti.Platform.Android.API_LEVEL >= 11 && activity.actionBar) {
				activity.actionBar.title = L('lecture_summary', 'Lecture Summary');
				activity.actionBar.displayHomeAsUp = true;
				activity.actionBar.onHomeIconItemSelected = function() {
					$.lecture_summary.close();
					$.lecture_summary = null;
				};
			}
		}
	});

	// Back Button - not really necessary here - this is the default behaviour anyway?
	$.lecture_summary.addEventListener('android:back', function() {
		$.lecture_summary.close();
		$.lecture_summary = null;
	});
}
