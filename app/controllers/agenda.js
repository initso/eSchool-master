//
// View Language
//
var AppData = require('data');

//ADD Data to The Table- Schedule
// Function To Generate Table Row
function createRow(time, name, prof, i) {
	// Create Table Row
	var tableRow = Ti.UI.createTableViewRow({
		dataId : i,
		className : 'row',
		objName : 'row',
		height : Alloy.Globals.Styles.TableViewRow.height,

	});
	console.log(i);
	// Create Table Row Columns
	var timeView = Ti.UI.createView({
		left : 0,
		width : "40%",
		height : Ti.UI.Size
	});
	var nameView = Ti.UI.createView({
		left : "40%",
		width : "60%",
		height : Ti.UI.Size
	});
	var profView = Ti.UI.createView({
		left : "75%",
		width : "25%",
		height : Ti.UI.Size
	});

	// Create Table Row Column Labels
	timeView.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : time,
		color : '#000'
	}));
	nameView.add(Ti.UI.createLabel({
		top : 5,
		right : 5,
		bottom : 5,
		left : 5,
		text : name,
		color : '#000'
	}));
	//profView.add(Ti.UI.createLabel({   top: 5, right: 5, bottom: 5, left: 5, text: prof  }));

	// Add Columns To Table Row
	tableRow.add(timeView);
	tableRow.add(nameView);
	//tableRow.add(profView);

	// Resource Clean-Up
	timeView = nameView = profView = null;

	// Finished
	return tableRow;
}


//
// Present our data - wrap it in an event handler which we can trigger when we manipulate our data store
// This eventListener is application-wide, but could be localised to this controller
// Using 'Ti.App.addEventListener' it can be triggered from other controllers
//

Ti.App.addEventListener('dataUpdated', function(e) {
	// Reset table if there are any existing rows (Alloy includes underscore)
	if (! _.isEmpty($.tableRecords.data)) {
		$.tableRecords.data = [];
		$.tableRecords.removeEventListener('click', tableClick);
	}

	// Set loading state
	$.activityIndicator.show();
	$.labelNoRecords.visible = false;

	// Require our data store - we are not creating a fresh instance each call
	// Access to the data module we are requiring works like a singleton (create new, or reuse if exists)

	AppData.getAll(function(dataStore) {
		if (!dataStore.length) {
			$.labelNoRecords.text = L('noRecordsFound', 'No Records Found');
			$.labelNoRecords.visible = true;
		} else {
			var recordData = [];
			console.log("here");
			console.log(dataStore);			
			for (var i = 0; i < dataStore.length; i++) {
				var record = dataStore[i];
				console.log(dataStore[i]);
				// This doesn't need to be a row, it could just be an object
				// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.TableView
				recordData.push(createRow(record.time, record.subject, record.teacher, i));
			}
			// Set the table data in one go rather than making repeated (costlier) calls on the loop
			$.tableRecords.setData([]);
			$.tableRecords.setData(recordData);
		}


		// Handle table clicks - either single click or longpress (holding button down then releasing)
		// Rather than passing the function directly as the 2nd arguement, pass a reference
		// This allows it to be removed later: $.tableRecords.removeEventListener('click', tableClick);
		if(AppData.getUserType()=="teacher"){
			$.tableRecords.addEventListener('click', tableClick);
		}

		$.activityIndicator.hide();
	});
});

// Manually call dataUpdated once to perform the initial table rendering (subsequently called after data edited)
Ti.App.fireEvent('dataUpdated');
// Either set the state for no records, or loop and add each item as a TableViewRow


//
// Action Handlers
//
// Table Clicks
function tableClick(e) {

	console.log("clicked");
	var dataId = e.rowData.dataId;

	var w = Alloy.createController('postWindow', {
		dataId : dataId,
		parentTab: "Schedule"
	});
	w.openWindow();
	$.list.close();
}
