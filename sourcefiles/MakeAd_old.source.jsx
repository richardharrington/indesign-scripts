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
    var columnCount, height;
    var myResult;
    
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
    
    // Most of the min and max validation for columnCount and height are done
    // by the API within the myDisplayDialog function, but we run this while loop
    // in order to account for the cases when the height is zero or the columnCount is unfilled
    // (or when the user pressed 'camcel').

    do {
        myResult = myDialog.show();
        if (!myResult) exit();
        columnCount = myColumnCountInput.editValue;
        height = myHeightInput.editValue;
    } while (!columnCount || !height);
    
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

var myResult = myDisplayDialog();

// These values are in points.

var width = (((PAGE_WIDTH + GUTTER_WIDTH) / MAX_COLUMNS) * myResult.columnCount) - GUTTER_WIDTH;
var height = myResult.height;

// Set the coordinates so the recangle will be centered in the active page.

var page = app.activeWindow.activePage;

var pageBounds = page.bounds;
var pageTop = pageBounds[0];
var pageLeft = pageBounds[1];
var pageBottom = pageBounds[2];
var pageRight = pageBounds[3];

var pageWidth = pageRight - pageLeft;
var pageHeight = pageBottom - pageTop;

var top = pageTop + (pageHeight / 2) - (height / 2);
var left = pageLeft + (pageWidth / 2) - (width / 2);

// Create the new rectangle and rule.

var myNewAd = page.rectangles.add({
    geometricBounds: [top, left, top + height, left + width],
    fillColor: "None",
    contentType: ContentType.GRAPHIC_TYPE,
    textWrapPreferences: {
        textWrapOffset: [10,0,0,0],
        textWrapMode:  TextWrapModes.BOUNDING_BOX_TEXT_WRAP
    }
});
var myNewRule = page.graphicLines.add({
    strokeColor: "Black",
    strokeWeight: 0.5,
    geometricBounds: [top - DISTANCE_OF_RULE_FROM_AD , left, top - DISTANCE_OF_RULE_FROM_AD, left + width ]
});

// Group them.

var myNewGroup = page.groups.add([myNewAd, myNewRule]);
myNewGroup.bringToFront();
myNewGroup.select();

// Restore ruler/measurement units.

myViewPreferences.horizontalMeasurementUnits = myOldXUnits;
myViewPreferences.verticalMeasurementUnits = myOldYUnits;

