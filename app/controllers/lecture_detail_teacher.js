var ui = require('ui'), Status = require('Status'), User = require('User'), Cloud = require('ti.cloud'), AppData = require('data'), currentBlob = null;

var args = arguments[0] || {};
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';

var teacher='';
var subject='';
var homeWork = true;
var test = true;

$.openWindow = function() {
	$.win.open({
		modal:true
	});
};

AppData.getAll(function(dataStore) {
	console.log("TRIAL:" + dataStore + "   " + dataStore[0]);
	var dataItem = dataStore[dataID];
	$.timeLabel.text = dataItem.time;
	teacher = dataItem.teacher;
	subject = dataItem.subject;

});

$.loading = Alloy.createController('loading');

if (!dataId)
	console.log("Form:" + dataId);


function actionHomeworkCheckbox(e) {
	if (e.source.check) {
		e.source.image = "/images/unchecked.png";
		e.source.check = false;
		homeWork = false;
	} else {
		e.source.image = "/images/checked.png";
		e.source.check = true;
		homeWork = true;

	}
}

function actionTestCheckbox(e) {
	if (e.source.check) {
		e.source.image = "/images/unchecked.png";
		e.source.check = false;
		test = false;
	} else {
		e.source.image = "/images/checked.png";
		e.source.check = true;
		test = true;
	}

}


//Handle image attachment
$.camera.on('click', function() {

	//for now, need to disable "choose from gallery" for android
	var options = [];
	options.push("Camera");
	if (OS_IOS) {
		options.push(L('photoGallery'));
	}
	options.push(L('cancel'));
	var od = Ti.UI.createOptionDialog({
		options : options,
		cancel : options.length > 2 ? 2 : 1,
		title : L('attachPhoto')
	});
	od.addEventListener('click', function(e) {
		var callbacks = {
			success : function(e) {
				currentBlob = e.media;
				$.preview.image = currentBlob;
				$.camera.animate({
					opacity : 0,
					duration : 250
				}, function() {
					 $.imagePreview.visible = true;
					 $.camera.visible = false;
					 $.imagePreview.animate({
						 opacity : 1,
						 duration : 250
					 });
					updateCount();
				});
			},
			error : function(e) {
				ui.alert('mediaErrorTitle', 'mediaErrorText');
			}
		};

		//decide which media API to call
		if (e.index === 0) {
			Ti.Media.showCamera(callbacks);
		} else if (e.index === 1 && options.length > 2) {
			Ti.Media.openPhotoGallery(callbacks);
		}
	});

	if (OS_IOS) {
		od.show({
			view : $.cameraLabel
		});
	} else {
		od.show();
	}

});

 $.deleteButton.on('click', function() {
	 $.imagePreview.animate({
		 opacity : 0,
		 duration : 250
	 }, function() {
		 $.camera.visible = true;
		 $.camera.animate({
			 opacity : 1,
			 duration : 250
		 }, function() {
			 $.imagePreview.visible = false;
			 $.preview.image = '';
			 currentBlob = null;
			 updateCount();
		 });
	 });
 });

//Track character count
var count = 140;
function updateCount() {
	var startNumber = (currentBlob) ? 118 : 140;
	count = startNumber - $.post.value.length;
	//$.characters.color = (count >= 0) ? '#000' : '#ff0000';
	//$.characters.text = count;
}

$.post.on('change', updateCount);

//DUMMY update summary

//track social post status, don't be done til these come back
$.saveBtn.on('click', function() {
	if ($.post.value || currentBlob) {
		//exit if content is not valid - TODO: put in better validation and feedback
		if ((currentBlob && $.post.value.length > 118) || (!currentBlob && $.post.value.length > 140)) {
			ui.alert('tooLong', 'tooLongMessage');
			return;
		}
		$.postContainer.add($.loading.getView());
		$.loading.start();

		var summary = [{
			"timeStamp" : $.timeLabel,
			"subject" : subject,
			"title" : $.title.value,
			"description" : $.post.value,
			"teacher" : teacher,
			"homework" : homeWork
		}];

		var today = AppData.getToday(new Date());
		AppData.updateSummary("IXA", today, summary);

		$.loading.stop();
		$.postContainer.remove($.loading.getView());
	}
});
