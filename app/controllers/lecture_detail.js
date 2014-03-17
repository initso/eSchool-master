var args = arguments[0] || {};
var AppData = require('data');
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
if(!dataId)
	console.log("Form:"+dataId);

$.back.on('click', function() {
	$.lectureDetailWin.close();
});

$.openWindow = function() {
	$.lectureDetailWin.open({
		modal:true
	});
	
	AppData.getSummary(function(dataStore) {
		console.log(dataId);
		var dataItem = dataStore[dataId];
		console.log(dataStore[dataId]);
		$.title.text=dataItem.title;
		$.teacherNameLabel.text=dataItem.teacher;
		$.details.text=dataItem.description;
		$.timings.text=dataItem.timeStamp;	
	});
			
};