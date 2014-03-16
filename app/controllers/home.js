//
// View Language
//
var AppData = require('data');
$.tabHome.title = L('home', 'Home');
$.home.title = L('home', 'Home');
$.labelHome.text = L('labelHome', 'Welcome ' + AppData.getUserName() + '!');

/*
 *
 *Changes Start
 *
 */

function createRow(image, title, i) {

	// Create Table Row
	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
	});

	// Create Table Row Columns
	var iv = Ti.UI.createImageView({
		image : image

	});
	tableRow.add(iv);

	var label = Ti.UI.createLabel({
		top : "80",
		text : title,
		color : '#000'
	});
	tableRow.add(label);

	// Finished
	return tableRow;
}

//
// Present our data - wrap it in an event handler which we can trigger when we manipulate our data store
// This eventListener is application-wide, but could be localised to this controller
// Using 'Ti.App.addEventListener' it can be triggered from other controllers
//
Ti.App.addEventListener('homeUpdated', function(e) {
	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.tableHome.data)) {
		$.tableHome.data = [];
		$.tableHome.removeEventListener('click', homeTableClick);
		//$.tableHome.removeEventListener('longpress', homeTableLongPress);
	}
	console.log("home instances");

	//Add the four icons on the Home Screen
	var recordData = [];
	var recordData2 = [];
	var recordData3 = [];
	var recordData4 = [];

	// This doesn't need to be a row, it could just be an object
	// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
	recordData.push(createRow('/images/appicon.png', "Lecture Summary", 1));
	recordData2.push(createRow('/images/appicon.png', "Students Scorecard", 2));
	recordData3.push(createRow('/images/appicon.png', "Teacher's Feedback", 3));
	recordData4.push(createRow('/images/appicon.png', "Schools Events", 4));
	// Set the table data in one go rather than making repeated (costlier) calls on the loop
	$.tableHome.setData(recordData);
	$.tableHome2.setData(recordData2);
	$.tableHome3.setData(recordData3);
	$.tableHome4.setData(recordData4);

	// Handle table clicks - either single click
	// Rather than passing the function directly as the 2nd arguement, pass a reference
	// This allows it to be removed later: $.tableHome.removeEventListener('click', homeTableClick);

	$.tableHome.addEventListener('click', homeTableClick);

	Ti.App.removeEventListener('homeUpdated',function(e){});
});

// Manually call homeUpdated and dataUpdated once to perform the initial table rendering (subsequently called after data edited)
//Ti.App.fireEvent('homeUpdated');
//Ti.App.fireEvent('dataUpdated');

/*
* Data Updated
* Till here
*/

//
// Action Handlers
//
function actionLogout() {
	var Cloud = require('ti.cloud');

	Cloud.Users.logout(function(e) {
		if (e.success) {

			loggedIn = false;
			Ti.App.Properties.removeProperty('loggedIn');
			Ti.App.Properties.removeProperty('userName');
			Ti.App.Properties.removeProperty('userType');
			AppData.userName = '';
			AppData.userType='';
			// Android close app, iOS open login controller
			if (OS_ANDROID) {
				var activity = Ti.Android.currentActivity;
				activity.finish();
			} else {
				var loginController = Alloy.createController('login');
				loginController.getView().open();
				Alloy.Globals.tabGroup.close();
				Alloy.Globals.tabGroup = null;
			}
			$.destroy();
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

//TODO: Add back buttons from everywhere
function homeTableClick(e) {
	var dataId = e.rowData.dataId;
	var nextController;
	console.log("here");
	console.log(dataId);
	if (dataId == 1) {
		nextController = Alloy.createController('lecture_summary');
		$.tabHome.open(nextController.getView());
	} else if (dataId == 2) {
		nextController = Alloy.createController('lecture_summary');
		$.tabHome.open(nextController.getView());
	} else if (dataId == 3) {
		nextController = Alloy.createController('lecture_summary');
		$.tabHome.open(nextController.getView());
	} else if (dataId == 4) {
		nextController = Alloy.createController('lecture_summary');
		$.tabHome.open(nextController.getView());
	}
}

/*
* End of TODO
*/

//
// Navigation
//

// Android
if (OS_ANDROID) {
	$.home.addEventListener('focus', function() {
		if (Alloy.Globals.tabGroup.activity) {
			var activity = Alloy.Globals.tabGroup.activity;

			// Menu
			activity.invalidateOptionsMenu();
			activity.onCreateOptionsMenu = function(e) {
				var menu = e.menu;
				var menuItem1 = menu.add({
					title : L('logout', 'Logout'),
					showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
				});
				menuItem1.addEventListener('click', actionLogout);
			};
		}
	});
}

// iOS
if (OS_IOS) {
	var btnRightNav = Ti.UI.createButton({
		title : L('logout', 'Logout')
	});
	btnRightNav.addEventListener('click', actionLogout);
	$.home.rightNavButton = btnRightNav;
}