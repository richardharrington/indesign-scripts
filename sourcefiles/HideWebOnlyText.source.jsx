#include utilities/util.jsx

(function() {
    var util = FORWARD.Util;
    var myStory;
    
    //Make certain that user interaction (display of dialogs, etc.) is turned on.
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    if (app.documents.length == 0) {
    	error_exit("No documents are open.  Please open a document and try again.");
    }
    if (app.selection.length == 0) {
    	error_exit("Please select something and try again.");
    }
    if (app.selection.length > 1) {
        error_exit("Please select only one item and try again.");
    }

    var mySel = app.selection[0];

    switch (mySel.constructor.name) {
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
    case "InsertionPoint":
    case "TextFrame":

        myStory = mySel.parentStory;
        break;

    case "Story":
        myStory = mySel;
        break;

    default:    
        error_exit("Please select a story, part of a story or a text frame, and start again.");
    }
    if (!myStory.isValid) {
    	error_exit( "There's been an error of indeterminate nature.  " + 
    	            "Probably best to blame the programmer." );
    }


    // AND NOW, THE MEAT OF THIS SCRIPT (THAT OTHER STUFF SHOULD BE IN A LIBRARY.)

    // Hide web-only content at end of story. If there's not any, inform the user.
    var successfullyHidText = util.hideWebOnlyText(myStory);

    if (!successfullyHidText) {
        error_exit ("In order to hide web-only text, you need to first type in the words " +
                    "'web only' on their own line at the end of the story, then put all your " +
                    "web-only text after that, then run this script again." );    
    }

    function error_exit (message) {
        if (arguments.length > 0) alert (unescape(message));
        exit();
    } 
})();

