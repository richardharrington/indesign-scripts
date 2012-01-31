// A quick and dirty version of ProcessText.source.jsx which 
// has everything removed except the conversion of markdown to Indesign.

#include utilities/util.jsx
#include utilities/markdownToIndesign.jsx

var util = FORWARD.Util;
var markdownToIndesign = FORWARD.markdownToIndesign;


var DEFAULT_HYPERLINK_PROPERTIES = {
  borderColor: [183, 27, 23],  // Burgundy, roughly.
  borderStyle: HyperlinkAppearanceStyle.DASHED,
  width: HyperlinkAppearanceWidth.THIN,
  visible: true,
};

var myObject;

//Make certain that user interaction (display of dialogs, etc.) is turned on.
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
if (app.documents.length == 0) util.errorExit("No documents are open.  Please open a document and try again.");
if (app.selection.length == 0) util.errorExit("Please select something and try again.");
switch (app.selection[0].constructor.name) {
    case "Character":
    case "Word":
    case "TextStyleRange":
    case "Line":
    case "Paragraph":
    case "TextColumn":
    case "Text":
    case "Cell":
    case "Column":
    case "Row":
    case "Table":

    // This if statement is necessary because of an apparent bug that
    // will cause the program to crash later if the selection is a Text
    // object and not a Story object, when you have the whole story selected.
    if (app.selection[0].length == app.selection[0].parentStory.length) {
        myObject = app.selection[0].parentStory;
    } else {
        myObject = app.selection[0];
    }
    break;
    
    case "Story":
    myObject = app.selection[0];
    break;
    
    // If they've selected a text frame, make sure they've selected only one, but if they have selected only one,
    // then both a text frame and an insertion point have the same result:  myObject = parentStory.
    case "TextFrame":
    if (app.selection.length > 1) util.errorExit("If you're going to select a text frame, " + "please select that text frame and nothing else, and try again.");
    
    case "InsertionPoint":
    myObject = app.selection[0].parentStory;
    break;
    
    default:

    //Something was selected, but it wasn't a text object, so search the document.
    util.errorExit("Please select a story, part of a story or a text frame, and start again.");
}
if (myObject == null) util.errorExit("There's been an error of indeterminate nature.  Probably best to blame the programmer.");


// Hyperlinks:  Convert markdown hyperlinks to InDesign Hyperlink objects.
markdownToIndesign.convert( myObject, DEFAULT_HYPERLINK_PROPERTIES, false ); // false means don't override existing Indesign hyperlinks.



