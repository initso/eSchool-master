//
// Check for expected controller args
//
var AppData = require('data');
var args = arguments[0] || {};
var parentTab = args.parentTab || '';
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
$.submit.title = L('submit', 'Submit');
$.homework.title = L('homework', 'Home Work');

//DUMMY update summary
summary = [{
	"timeStamp" : "09:00 am",
	"subject" : "History",
	"title" : "World War 2",
	"description" : "World War II although some",
	"teacher" : "ht@teachers.stjohns.edu",
	"homework" : "false"
}, {
	"timeStamp" : "07:30 am",
	"subject" : "History",
	"title" : "World War 2",
	"description" : "World War II also known as the Second World War",
	"teacher" : "hemant@teachers.stjohns.edu",
	"homework" : "false"
}];

//
// The list controller "shouldn't" call detail unless it has an id it is going to pass it in the first place
// Just double check we got it anyway and do nothing if we didn't
//

//Create Form for Entering the Lecture Summary for the Data.
function createForm(subject, teacher, description, homework) {
	$.subject.text = "Subject: " + subject;
	$.teacher.text = "Teacher: " + teacher;
	$.description.value = "Enter your description here";
	$.homework.value = homework;
	if (AppData.userType == "teacher") {
		$.description.editable = false;
	}
}

if (dataId !== '') {
	//
	// Fetch data row and assign title value to the label/window title (nothing else!)
	//

	var dataItem = AppData.getItem(dataId);
	$.detail.title = dataItem.title;
	createForm(dataItem.subject, dataItem.teacher, "Enter your description here", false);

	//
	// Navigation
	//

	// Android
	if (OS_ANDROID) {
		$.detail.addEventListener('open', function() {
			if ($.detail.activity) {
				var activity = $.detail.activity;

				// Action Bar
				if (Ti.Platform.Android.API_LEVEL >= 11 && activity.actionBar) {
					activity.actionBar.title = L('detail', 'Detail');
					activity.actionBar.displayHomeAsUp = true;
					activity.actionBar.onHomeIconItemSelected = function() {
						$.detail.close();
						$.detail = null;
						Ti.App.fireEvent('dataUpdated');
					};
				}
			}
		});

		// Back Button - not really necessary here - this is the default behaviour anyway?
		$.detail.addEventListener('android:back', function() {
			Ti.App.fireEvent('dataUpdated');
			$.detail.close();
			$.detail = null;
		});

		$.submit.addEventListener('click', function() {
			AppData.updateSummary("IXA", "2014-03-08T00:00:00+0000", summary);
		});
	}

	// iOS
	// as detail was opened in the tabGroup, iOS will handle the nav itself (back button action and title)
	// but we could change the iOS back button text:
	//$.detail.backButtonTitle = L('backText', 'Back to List');
}