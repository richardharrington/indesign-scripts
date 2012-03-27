// TODO:

/* ADD a special section in the dialog box for selecting common ad sizes.
   Perhaps have a radio control which disables the entire bottom part until you click
   on the radio control. The radio button which enables the bottom part 
   would be called "custom ad.") 
*/

#include utilities/util.jsx

var util = FORWARD.Util;

var PAGE_HEIGHT = 1332; // points
var PAGE_WIDTH = 828; // points
var GUTTER_WIDTH = 10; // points
var DISTANCE_OF_RULE_FROM_AD = 5; // points
var MAX_COLUMNS = 6;

// TODO: add some options for selecting common ad sizes.

var myDisplayDialog = function(columnCount) {

    var myDialog = app.dialogs.add({
        name: "Make ad"
    });
    
    var myMainColumn;
    var myColumns 
    var myRows = [];
    var columnCountDialogProperties;
    var myPageNumberInput;
    var myFilenameInput;
    var myEmailInput;
    var height;
    
    myMainColumn = myDialog.dialogColumns.add().dialogRows.add().borderPanels.add().dialogColumns.add();
    myRows[0] = myMainColumn.dialogRows.add();
    myRows[1] = myMainColumn.dialogRows.add();
    
    // Input row for column count of ad
    myRows[0].dialogColumns.add().staticTexts.add({
        staticLabel: "Number of columns:"
    });
    columnCountDialogProperties = {
          minWidth: 150,
          stringList: ['1', '2', '3', '4', '5', '6'],
          minimumValue: 1,
          maximumValue: MAX_COLUMNS
    };
    
    // If we're running this function again because of an error,
    // the columnCount will be supplied.
    if (columnCount) {
        columnCountDialogProperties.editValue = columnCount;
    }
    myColumnCountInput = myRows[0].dialogColumns.add().integerComboboxes.add(columnCountDialogProperties); 
    
    // Input row for height of ad
    myRows[1].dialogColumns.add().staticTexts.add({
        staticLabel: "Height:"
    });
    myHeightInput = myRows[1].dialogColumns.add().measurementEditboxes.add({
          minWidth: 300,
          maximumValue: PAGE_HEIGHT,
          editUnits: MeasurementUnits.INCHES_DECIMAL,
          editValue: 0
    }); 
        
    var myResult = myDialog.show();
    if (!myResult) exit();
    
    //        myDialog.destroy() cannot be used because of a bug in ID CS5
    //        on 64-bit machines. They totally crash. So we'll just
    //        have the dialog boxes cluttering up non-Javascript-related
    //        InDesign memory, but it's really unlikely to be all that bad.
    
    //        myDialog.destroy();
    
    columnCount = myColumnCountInput.editValue;
    height = myHeightInput.editValue;
    return {
        columnCount: columnCount,
        height: height
    };
};
// Preserve current settings for measurement units.                                
                                                                                   
var myViewPreferences = app.activeDocument.viewPreferences;                        
var myOldXUnits = myViewPreferences.horizontalMeasurementUnits;                    
var myOldYUnits = myViewPreferences.verticalMeasurementUnits;
myViewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
myViewPreferences.verticalMeasurementUnits = MeasurementUnits.points;

// Most of the min and max validation for columnCount and height are done
// by the API within the myDisplayDialog function, but we run this while loop
// in order to account for the cases when the height is zero or the columnCount is unfilled.

var columns;
do {
    // columns will be undefined the first time.
    myResult = myDisplayDialog(columns);
    columns = myResult.columnCount;
} while (!myResult.columnCount || !myResult.height);


var myResult = myDisplayDialog();
// columnCount has now been validated by the API, along with max value of height.
// Still need to make sure height is not zero.


// TODO: some error processing to take account of if the user has typed in zero height.

// These values are in points.

var width = (((PAGE_WIDTH + GUTTER_WIDTH) / MAX_COLUMNS) * myResult.columnCount) - GUTTER_WIDTH;
var height = myResult.height;

// Make the rectangle and the rule.

// TODO: have top and left be calculated from the center of the window, 
// minus half the width and half the height.

// OR, alternatively, have it snap to a margin guide.

// EVEN COOLER would be to have the user be able to place the ad with a little cursor like you can
// place multiple pictures imported from Photoshop. Not sure that's going to work.

var top = 100;
var left = 100;

var page = app.activeWindow.activePage;
var myNewAd = page.rectangles.add({
    geometricBounds: [top, left, top + height, left + width]
    
    // TODO: add text wrap info.
    // TODO: set background color and stroke width
    
});
var myNewRule = page.graphicLines.add({
    // TODO: figure out how to indicate strokeColor: BLACK
//    strokeColor: "[Black]",
    strokeWeight: 0.5,
    geometricBounds: [top -DISTANCE_OF_RULE_FROM_AD , left, top - DISTANCE_OF_RULE_FROM_AD, left + width ]
});

// Group them.

var myNewGroup = page.groups.add([myNewAd, myNewRule]);
myNewGroup.bringToFront();

// Restore ruler/measurement units.

myViewPreferences.horizontalMeasurementUnits = myOldXUnits;
myViewPreferences.verticalMeasurementUnits = myOldYUnits;

