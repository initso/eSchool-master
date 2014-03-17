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

	$.submit.addEventListener('click', function() {
		AppData.updateSummary("IXA", "2014-03-08T00:00:00+0000", summary);
	});

}