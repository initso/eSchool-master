var AppData = require('data'), User = require('User');

if(AppData.getUserType()=="teacher"){
	var teacherContainer=Alloy.createController('teacher_feedback');
	$.feedback.add(teacherContainer.getView());
}else{
	var studentContainer= Alloy.createController('student_feedback');
	$.feedback.add(studentContainer.getView());
}


