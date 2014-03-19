var AppData = require('data'), User = require('User');
var args = arguments[0] || {};
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
var dateStamp= args.dateStamp;

if(!dataId)
	console.log("Form:"+dataId);

$.back.on('click', function() {
	$.lectureDetailWin.close();
});

$.openWindow = function() {
	$.lectureDetailWin.open({
		modal:true
	});
	
	if(AppData.getUserType()=="teacher"){
		var teacherContainer=Alloy.createController('lecture_detail_teacher', {
			dataId : dataId,
			dateStamp: dateStamp
		});
		$.lectureDetailWin.add(teacherContainer.getView());
	}else{
		var studentContainer= Alloy.createController('lecture_detail', {
			dataId : dataId,
			dateStamp: dateStamp
		});
		$.lectureDetailWin.add(studentContainer.getView());
	}		
};