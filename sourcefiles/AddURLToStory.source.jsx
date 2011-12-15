// This script associates a URL with a story in InDesign or 
// InCopy via the insertLabel method, which then allows the script 
// EditOnWeb to open a web browser to that URL.

// This is useful for editing stories in a CMS.
// You can cut and paste the URL of the story's CMS entry into 
// the prompt dialog box in this script, and then the story is tied 
// to that page forever.

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
    alertExit( 'Please select something and try again.' );
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
    var myInput = prompt ("What is the URL that you want associated with this story?", 
                           myStory.extractLabel( "URI" )); // if no existing label, 
                                                           // it's automatically the empty string
    if (myInput === null) {
        exit();
    }

    // Check if it's a reasonable URL.
    if (myInput.match( /(https?\:\/\/)?[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?$/ ) ) {
    
        // If the person neglected the "http://", add it
        if (!myInput.match( /^https?\:\/\// )) {
            myInput = "http://" + myInput;
        }
    
        myStory.insertLabel( "URI", myInput );
        exit();
        
    } else {
        alertExit( "Please try again and type in a valid URL." );
    }
    
} else {
    alertExit( "Please select some text or a text frame and try again." );
}
      
