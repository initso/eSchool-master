var AppData= require('data');


//
// Check for expected controller args
//
var args = arguments[0] || {};
var parentTab = args.parentTab || '';

//Table Generator
function createRow(subject, teacher, description, alerts, i) {
	// Create Table Row

	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
		height : Alloy.Globals.Styles.TableViewRow.height,
	});
	var tabBackRow = Ti.UI.createView();

	var tabRow = Ti.UI.createView({
		classes : 'tableRow'
	});
	var view1 = Ti.UI.createView();

	var style = $.createStyle({
		classes : 'subject'
	});

	var subjectLabel = Ti.UI.createLabel({
		text : subject,
		classes : 'subject'
	});

	subjectLabel.applyProperties(style);

	view1.add(subjectLabel);

	if (alerts) {
		var style1 = $.createStyle({
			classes : 'rightImage'
		});

		var rightImage = Ti.UI.createImageView();
		rightImage.applyProperties(style1);

		view1.add(rightImage);
	}

	var stylelecture = $.createStyle({
		classes : 'lectureDetail'
	});

	var lectureDetail = Ti.UI.createView();
	lectureDetail.applyProperties(stylelecture);

	var style2 = $.createStyle({
		classes : 'teacher'
	});

	var teacherLabel = Ti.UI.createLabel({
		text : teacher
	});
	teacherLabel.applyProperties(style2);

	var style4 = $.createStyle({
		classes : 'description',
		id : 'description1'
	});

	var description1Label = Ti.UI.createLabel({
		text : description
	});
	description1Label.applyProperties(style4);

	lectureDetail.add(teacherLabel);
	lectureDetail.add(description1Label);

	var style5 = $.createStyle({
		classes : 'description',
		id : 'description2'
	});


	tabRow.add(view1);
	tabRow.add(lectureDetail);

	tabBackRow.add(tabRow);
	tableRow.add(tabBackRow);

	console.log(i);
	// Resource Clean-Up

	// Finished
	return tableRow;
}

function actionDatePick(e) {
	var picker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		minDate : new Date(2009, 0, 1),
		maxDate : new Date(2014, 11, 31),
		value : new Date()
	});

	if (Ti.Platform.osname === 'android') {
		picker.showDatePickerDialog({
			value : new Date(),
			callback : function(e) {
				if (e.cancel) {
					Ti.API.info('User canceled dialog');
				} else {
					$.date.text= AppData.getToday(e.value);
					Ti.API.info('User selected date: ' + e.value);
					Ti.App.fireEvent('summaryUpdated'); 
				}
			}
		});
	} else {
		picker.top = '50dp';
		$.lectureSummaryWin.add(picker);
		picker.addEventListener('change', function(e) {
			Ti.API.info("User selected date: " + e.value.toLocaleString());
			$.lectureSummaryWin.remove(picker);
		});
	}
	
}

// Lecture summary table click event - open Lecture Details Page
function actionLectureDetail(e) {
	var dataId = e.index;
	//index of row that has been clicked

	console.log(dataId);

	var win = Alloy.createController('detail', {
		dataId : dataId,
		dateStamp: $.date.text
	});

	win.openWindow();
	$.lectureSummaryWin.close();
}

Ti.App.addEventListener('summaryUpdated', function(e) {
	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.table.data)) {
		$.table.data = [];
		//$.table.removeEventListener('click', actionLectureDetail);
		// $.table.removeEventListener('longpress', tableLongPress);
	}
	var dateStamp= $.date.text;
	console.log(dateStamp);
	AppData.getSummary("IXA", dateStamp, function(dataStore) {
		
		var recordData = [];
		for (var i = 0; i < dataStore.length; i++) {
			var record = dataStore[i];
			console.log(dataStore[i]);
			// This doesn't need to be a row, it could just be an object
			// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
			recordData.push(createRow(record.title, record.teacher, record.description, record.homework, i));
		}
		// Set the table data in one go rather than making repeated (costlier) calls on the loop
		$.table.setData([]);
		$.table.setData(recordData);
		$.count.text=dataStore.length;
	});
});


$.date.text=AppData.getToday(new Date());
Ti.App.fireEvent('summaryUpdated'); 