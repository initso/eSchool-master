//
// View Language
//
$.tabList.title = L('list', 'Schedule');
$.list.title = L('list', 'Schedule');
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
		$.tableRecords.removeEventListener('longpress', tableLongPress);
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
			
			console.log("fin:" + dataStore["7-7:30 am"]);
			for (var i = 0; i < dataStore.length; i++) {
				var record = dataStore[i];
				//console.log(dataStore[i]);
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
		$.tableRecords.addEventListener('click', tableClick);
		$.tableRecords.addEventListener('longpress', tableLongPress);
		$.activityIndicator.hide();
	});
	Ti.App.removeEventListener('dataUpdated',function(e){});
});

// Manually call dataUpdated once to perform the initial table rendering (subsequently called after data edited)
//Ti.App.fireEvent('dataUpdated');
// Either set the state for no records, or loop and add each item as a TableViewRow

//
// Action Handlers
//
// Table Clicks
function tableClick(e) {
	var dataId = e.rowData.dataId;

	console.log(dataId);
	// All single clicks are just going to open the detail window for this item
	// We pass the tab object to the child controller so if it needed to open a window it has a reference to the parent tab in which to do so
	// Rather than passing $.tabList as a controller arg, we could set: Alloy.Globals.tabList = $.tabList; outside of this function
	// and have the child controller call: Alloy.Globals.tabList.open(someController.getView()) instead of parentTab.open(someController.getView())
	var detailController = Alloy.createController('detail', {
		parentTab : $.tabList,
		dataId : dataId
	});
	// As detail controller will only be opened from this list controller, which will call an open() method on it
	// there is no need in the detail.js controller to call $.detail.open();
	$.tabList.open(detailController.getView());
}

// Long clicks open the options menu, enabling us to view, delete, or cancel the row item
function tableLongPress(e) {
	var dataId = e.rowData.dataId;

	var dialog = Ti.UI.createOptionDialog({
		options : ['View', 'Delete', 'Cancel'],
		cancel : 2,
		destructive : 1,
		persistent : false,
		dataId : dataId
	});

	// Handle clicks on our dialog menu itself
	dialog.addEventListener('click', function(e) {
		var index = e.index;
		var dataId = e.source.dataId;

		// View option selected
		if (dataId !== '' && index === 0) {
			var detailController = Alloy.createController('detail', {
				parentTab : $.tabList,
				dataId : dataId
			});
			$.tabList.open(detailController.getView());
		} else if (dataId !== '' && index === 1) {
			// Delete option selected
			// Checking for !== '' specifically as dataId in this case could be 0 - array key 1st position

			AppData.deleteItem(dataId);
			//Ti.App.fireEvent('dataUpdated');
		}

		// Tidy up our dialog
		// Need to look into comparing performance of this approach (rebuilding dialog each time)
		// Vs creating a single dialog and reusing it each time (changing the dataId)
		dialog.hide();
		dialog = null;
	});

	// Open it
	dialog.show();
}

