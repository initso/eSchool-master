var args = arguments[0] || {};
var AppData = require('data');
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
var dateStamp = args.dateStamp;
if (!dataId)
	console.log("Form:" + dataId);

$.backArrow.on('click', function() {
	$.lectureDetailWin.close();
});

$.attachment.on('click', function() {
	// select attachment code
});

$.openWindow = function() {
	$.lectureDetailWin.open({
		modal : true
	});
};

AppData.getSummary("IXA", dateStamp, function(dataStore) {
	console.log(dataId);
	var dataItem = dataStore[dataId];
	//console.log(dataStore[dataId]);
	$.title.text = dataItem.title;
	$.teacherNameLabel.text = dataItem.teacher;
	$.details.text = dataItem.description;
	$.timings.text = dataItem.timeStamp;
});
