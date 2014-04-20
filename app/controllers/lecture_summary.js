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
		objName : 'row'
	});
	var rowStyle = $.createStyle({
		classes : 'tableRow'
	});
	tableRow.applyProperties(rowStyle);
	
	var tableRowBackgroundView = Ti.UI.createView({
		classes : 'tableRowBackgoundView'
	});
	var rowBackgroundStyle = $.createStyle({
		classes : 'tableRowBackgoundView'
	});
	tableRowBackgroundView.applyProperties(rowBackgroundStyle);
	
	var tableRowContentView = Ti.UI.createView({
		classes : 'tableRowContentView'
	});
	var rowContentStyle = $.createStyle({
		classes : 'tableRowContentView'
	});
	tableRowContentView.applyProperties(rowContentStyle);

	var subjectLabel = Ti.UI.createLabel({
		text : subject,
		classes : 'subjectLabel'
	});
	var subjectStyle = $.createStyle({
		classes : 'subjectLabel'
	});
	subjectLabel.applyProperties(subjectStyle);
	
	var timeContainerView = Ti.UI.createView({
		classes : 'timeContainerView'
	});
	var styletimeContainer = $.createStyle({
		classes : 'timeContainerView'
	});
	timeContainerView.applyProperties(styletimeContainer);
	
	var timeLabel = Ti.UI.createLabel({
		text : '8.00 am - 8.30 am',
		classes : 'timeLabel'
	});
	var styleTime = $.createStyle({
		classes : 'timeLabel'
	});
	timeLabel.applyProperties(styleTime);
	 
	var teacherLabel = Ti.UI.createLabel({
		text : teacher,
		classes : 'teacherLabel'
	});
	var styleTeacher = $.createStyle({
		classes : 'teacherLabel'
	});
	teacherLabel.applyProperties(styleTeacher);
	
	timeContainerView.add(timeLabel);
	timeContainerView.add(teacherLabel);
	
	var lectureDetailLabel = Ti.UI.createLabel({
		text: description,
		classes : 'lectureDetailLabel'
	});
	var styleLectureDetail = $.createStyle({
		classes : 'lectureDetailLabel'
	});
	lectureDetailLabel.applyProperties(styleLectureDetail);
	
	tableRowContentView.add(subjectLabel);
	tableRowContentView.add(timeContainerView);
	tableRowContentView.add(lectureDetailLabel);
	tableRowBackgroundView.add(tableRowContentView);
	tableRow.add(tableRowBackgroundView);

	if (alerts) {
		var rightImageStyle = $.createStyle({
			classes : 'rowRightImageTest'
		});

		var rightImage = Ti.UI.createImageView();
		rightImage.applyProperties(rightImageStyle);

		tableRow.add(rightImage);
	};

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

	var win = Alloy.createController('lecture_detail', {
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