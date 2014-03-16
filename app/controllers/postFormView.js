var ui = require('ui'),
	Status = require('Status'),
	User = require('User'),
	Cloud = require('ti.cloud'),
	AppData= require('data'),
	currentBlob = null;
	
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

$.blur = function() {
	$.post.blur();
};

console.log("hey");
$.post.blur();
//Handle image attachment
$.camera.on('click', function() {
	
	console.log("Inside");
	//for now, need to disable "choose from gallery" for android
	var options = [];
	options.push("Camera");
	if (OS_IOS) {
		options.push(L('photoGallery'));
	}
	options.push(L('cancel'));
	console.log(options);
	console.log("pushed");
	var od = Ti.UI.createOptionDialog({
		options:options,
		cancel:options.length > 2 ? 2 : 1,
		title:L('attachPhoto')
	});
	console.log("created dialog");
	od.addEventListener('click', function(e) {
		var callbacks = {
			success: function(e) {
				currentBlob = e.media;
				$.preview.image = currentBlob;
				$.camera.animate({
					opacity:0,
					duration:250
				}, function() {
					$.imagePreview.visible = true;
					$.imagePreview.animate({
						opacity:1,
						duration:250
					});
					updateCount();
				});
			},
			error: function(e) {
				ui.alert('mediaErrorTitle', 'mediaErrorText');
			}
		};
		
		//decide which media API to call
		if (e.index === 0) {
			Ti.Media.showCamera(callbacks);
		}
		else if (e.index === 1 && options.length > 2) {
			Ti.Media.openPhotoGallery(callbacks);
		}
	});

	if (OS_IOS) {
		od.show({
			view:$.camera
		});
	}
	else {
		od.show();
	}

});

$.deleteButton.on('click', function() {
	$.imagePreview.animate({
		opacity:0,
		duration:250
	}, function() {
		$.camera.animate({
			opacity:1,
			duration:250
		}, function() {
			$.imagePreview.visible = false;
			$.preview.image = '';
			currentBlob = null;
			updateCount();
		});
	});
});

//Manage social connection state
var homeWork = false;
$.facebook.on('click', function() {
	$.facebook.backgroundImage = '/img/post/btn-facebook-on.png';
	homeWork=true;
});

var test = false;
$.twitter.on('click', function() {
	$.twitter.backgroundImage = '/img/post/btn-twitter-on.png';
	test=true;
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
summary = [{
	"timeStamp" : "09:00 am",
	"subject" : "History",
	"title" : "World War 2",
	"description" : "World War II although some",
	"teacher" : "ht@teachers.stjohns.edu",
	"homework" : "false"
}];



//track social post status, don't be done til these come back
$.submit.on('click', function() {
	if ($.post.value || currentBlob) {
		
		//exit if content is not valid - TODO: put in better validation and feedback
		if ((currentBlob && $.post.value.length > 118) ||
			(!currentBlob && $.post.value.length > 140)) {
			ui.alert('tooLong', 'tooLongMessage');
			return;
		}
		
		var currentPost = $.post.value;
		$.postContainer.add($.loading.getView());
		$.loading.start();
		AppData.updateSummary("IXA", "2014-03-16T00:00:00+0000", summary);
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

