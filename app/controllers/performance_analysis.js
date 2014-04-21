var AppData= require('data');


//
// Check for expected controller args
//
var args = arguments[0] || {};
var parentTab = args.parentTab || '';

//Table Generator
function createRow(subject, time, marks, average, i) {
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
	
	var timeLabel = Ti.UI.createLabel({
		text : time,
		classes : 'timeLabel'
	});
	var styleTime = $.createStyle({
		classes : 'timeLabel'
	});
	timeLabel.applyProperties(styleTime);
	
	var marksContainerView = Ti.UI.createView({
		classes : 'marksContainerView'
	});
	var averageContainerView = Ti.UI.createView({
		classes : 'marksContainerView'
	});
	var marksContainerStyle = $.createStyle({
		classes : 'marksContainerView'
	});
	marksContainerView.applyProperties(marksContainerStyle);
	averageContainerView.applyProperties(marksContainerStyle);
	averageContainerView.top = '1dp';
	
	var marksObtainedLabel = Ti.UI.createLabel({
		text: 'Marks Obtained:',
		classes : 'marksHeadingLabel'
	});
	var averageObtainedLabel = Ti.UI.createLabel({
		text: 'Average Marks:',
		classes : 'marksHeadingLabel'
	});
	var marksHeadingStyle = $.createStyle({
		classes : 'marksHeadingLabel'
	});
	marksObtainedLabel.applyProperties(marksHeadingStyle);
	averageObtainedLabel.applyProperties(marksHeadingStyle);
	
	var marksLabel = Ti.UI.createLabel({
		text: marks,
		classes : 'marksLabel'
	});
	var averageLabel = Ti.UI.createLabel({
		text: average,
		classes : 'marksLabel'
	});
	var marksStyle = $.createStyle({
		classes : 'marksLabel'
	});
	marksLabel.applyProperties(marksStyle);
	averageLabel.applyProperties(marksStyle);
	
	marksContainerView.add(marksObtainedLabel);
	marksContainerView.add(marksLabel);
	
	averageContainerView.add(averageObtainedLabel);
	averageContainerView.add(averageLabel);
	
	tableRowContentView.add(subjectLabel);
	tableRowContentView.add(timeLabel);
	tableRowContentView.add(marksContainerView);
	tableRowContentView.add(averageContainerView);
	tableRowBackgroundView.add(tableRowContentView);
	tableRow.add(tableRowBackgroundView);

	console.log(i);
	// Resource Clean-Up

	// Finished
	return tableRow;
}

var rd=[];
rd.push(createRow('Water Cycle', '8.00 am - 8.30 am', '30/50', '32/50', 0));
rd.push(createRow('Water Cycle', '8.00 am - 8.30 am', '30/50', '32/50', 1));
$.table.setData(rd);
$.count.text='2';
		
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
//					Ti.App.fireEvent('summaryUpdated'); 
				}
			}
		});
	} else {
		picker.top = '50dp';
		$.performanceAnalysisWin.add(picker);
		picker.addEventListener('change', function(e) {
			Ti.API.info("User selected date: " + e.value.toLocaleString());
			$.performanceAnalysisWin.remove(picker);
		});
	}
	
}

// table click event - open new test page
function actionNewTest(e) {
//	var win = Alloy.createController('new_test', {
//		
//	});
//
//	win.openWindow();
//	$.performanceAnalysisWin.close();
}

$.date.text=AppData.getToday(new Date()); 