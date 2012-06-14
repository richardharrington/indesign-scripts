// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


// This script depends upon the user having previously run
// the AddURLToStory script on a story. This script finds that
// URL (via the extractLabel method) and opens a browser to that page.

// This is useful for going to a page in a CMS that is associated with a story.

function equalsIn( value, array ) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (value === array[i]) return true;
    }
    return false;
}

function alertExit( message ) {
    if (message) {
        alert( unescape( message ));
    }
    exit();
}

if (app.selection.length === 0) {
    alertExit( "Please select something and try again.");
} else if (app.selection.length > 1) {
    alertExit( 'Please select some text or a text frame (only one) and try again.');
}

var mySelection = app.selection[0];
if (equalsIn( mySelection.constructor.name, 
             ["Character", "Word", "TextStyleRange", "Line",
              "Paragraph", "TextColumn", "Text",
              "InsertionPoint", "TextFrame", "Story"])) {
                  
    var myStory = (mySelection.constructor.name === "Story") ? mySelection :
                   mySelection.parentStory;
                   
    var myURI = myStory.extractLabel( "URI" );
    if (myURI === "") {
        alertExit( "This story has not been linked to a webpage yet. " +
                   "Run the script 'AddURLToStory' and then try again." );
    }
    var tempDest = app.documents[0].hyperlinkURLDestinations.add( myURI );
    tempDest.showDestination();
    tempDest.remove();
    
} else {
    alertExit( "Please select some text or a text frame and try again." );
}

