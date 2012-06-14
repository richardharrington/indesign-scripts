// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


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
    var webOnlyTextStr = util.webOnlyText(myStory, true); // true means erase text object from the story.
    if (webOnlyTextStr && webOnlyTextStr.match(/\S/)) {
        if (myStory.label) {
            alert("There's already some hidden web-only text, so we're going to add " +
                  "the text that's at the end of the story now to what's already there, " +
                  "stored in the secret place. To see it all, go to 'Show Web-only Text' in the Edit menu.");
            myStory.label += '\r\r';
        }
        myStory.label += webOnlyTextStr;
    } else {
        error_exit ("In order to hide web-only text, you need to first type in the words " +
                    "'web only' on their own line at the end of the story, then put all your " +
                    "web-only text after that, then run this script again." );            
    }

    function error_exit (message) {
        if (arguments.length > 0) alert (unescape(message));
        exit();
    } 
})();

