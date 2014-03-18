var ui = require('ui'), Status = require('Status'), User = require('User'), Cloud = require('ti.cloud'), AppData = require('data'), currentBlob = null;

$.loading = Alloy.createController('loading');

$.post.hide();
//Bubble focus event
$.post.on('focus', function(e) {
	$.trigger('focus', e);
});

$.post.on('blur', function(e) {
	$.trigger('blur', e);
});

//Expose TextArea focus
$.focus = function() {
	$.post.focus();
};

var dataID = '';
var parentTab = '';
$.passParameters = function(arguments) {
	var args = arguments[0] || {};
	dataID = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
	parentTab = args.parentTab || '';
	console.log("PARENT TAB IS::::::"+ parentTab);
};

if (parentTab == "Feedback") {
	$.twitter.hide();
	$.facebook.hide();
}

$.blur = function() {
	$.post.blur();
};

console.log(dataID);

$.post.blur();
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
			view : $.camera
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

//Home-work and Test
var homeWork = false;
$.facebook.on('click', function() {
	$.facebook.backgroundImage = '/img/post/btn-facebook-on.png';
	homeWork = true;
});

var test = false;
$.twitter.on('click', function() {
	$.twitter.backgroundImage = '/img/post/btn-twitter-on.png';
	test = true;
});

//Track character count
var count = 140;
function updateCount() {
	var startNumber = (currentBlob) ? 118 : 140;
	count = startNumber - $.post.value.length;
	$.characters.color = (count >= 0) ? '#000' : '#ff0000';
	$.characters.text = count;
}

$.post.on('change', updateCount);

//DUMMY update summary

//track social post status, don't be done til these come back
$.submit.on('click', function() {
	if ($.post.value || currentBlob) {
		//exit if content is not valid - TODO: put in better validation and feedback
		if ((currentBlob && $.post.value.length > 118) || (!currentBlob && $.post.value.length > 140)) {
			ui.alert('tooLong', 'tooLongMessage');
			return;
		}
		$.postContainer.add($.loading.getView());
		$.loading.start();

		if (parentTab == "Feedback") {

			console.log("WTFFF");
			var feedback = [{
				"teacher" : AppData.getUserName(),
				"feedback" : $.post.value
			}];
			User.searchStudents(classStack[e.index], "Student", function(students) {
				AppData.sendFeedback("Feedback", students[dataID].username, feedback);
			});
		} else {

			AppData.getAll(function(dataStore) {
				console.log("TRIAL:" + dataStore + "   " + dataStore[0]);
				var dataItem = dataStore[0];
				var summary = [{
					"timeStamp" : dataItem.time,
					"subject" : dataItem.subject,
					"title" : "World War 2",
					"description" : $.post.value,
					"teacher" : dataItem.teacher,
					"homework" : homeWork
				}];

				var currentPost = $.post.value;
				var today = AppData.getToday(new Date());
				AppData.updateSummary("IXA", today, summary);
			});

		}
		$.loading.stop();
		$.postContainer.remove($.loading.getView());
	}
});

//Reset UI for next post
$.reset = function() {
	//reset social
	fbOn = false;
	$.facebook.backgroundImage = '/img/post/btn-facebook-off.png';
	twitterOn = false;
	$.twitter.backgroundImage = '/img/post/btn-twitter-off.png';

	//reset post
	$.post.value = '';
	count = 140;
	$.characters.text = count;
	$.characters.visible = false;

	//reset image
	currentBlob = null;
	$.imagePreview.visible = false;
	$.imagePreview.opacity = 0;
	$.preview.image = '';
	$.camera.opacity = 1;
};

