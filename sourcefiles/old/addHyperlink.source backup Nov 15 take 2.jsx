/* 

This script performs one of two functions: either
it creates a new hyperlink on the selected text,
or it edits an existing one.

*/


#include utilities.jsx

var DEFAULT_HYPERLINK_PROPERTIES = {
	  borderColor: [183, 27, 23],  // Burgundy, roughly.
  	borderStyle: HyperlinkAppearanceStyle.DASHED,
    width: HyperlinkAppearanceWidth.THIN,
    visible: true,
}

function getTextSelection() {

    if (app.documents.length == 0) {
    	  error_exit("No documents are open.  Please open a document and try again.");
    }    if (app.selection.length == 0) {
    	  error_exit("Please select something and try again.");
    }
    
    var myObject;
    var mySel = app.selection[0];
        switch (mySel.constructor.name) {    case "Character":    case "Word":    case "TextStyleRange":    case "Line":    case "Paragraph":    case "TextColumn":    case "Text":    case "Cell":    case "Column":    case "Row":    case "Table":
        myObject = mySel;
        break;
            case "Story":
    case "TextFrame":        error_exit ("Please select some text (not a whole story) and try again.");        break;
            default:
        error_exit("Please select some text and try again.");    		    if (!myObject.isValid) {
		    	error_exit( "There's been an error of indeterminate nature.  " + 
		    	            "Probably best to blame the programmer." );
		    }
    }
		    
    return myObject;
    
}


var myDisplayDialog = function( defaultText ) {
	
	  var defaultText = defaultText || "";
    
    var myDialog = app.dialogs.add({        name: "Type in a URL"    });
    
    var myOuterColumns = [];
    var myInnerColumns = [];
    var myOuterRows = [];
    var myBorderPanels = [];
    var myTextEditboxes = [];
    var myInput;
        myOuterColumns[0] = myDialog.dialogColumns.add();    myOuterRows[0] = myOuterColumns[0].dialogRows.add();    myBorderPanels[0] = myOuterRows[0].borderPanels.add();    myInnerColumns[0] = myBorderPanels[0].dialogColumns.add();    myInnerColumns[0].staticTexts.add({        staticLabel: "URL:"    });
    
    myInnerColumns[1] = myBorderPanels[0].dialogColumns.add();        
    myTextEditboxes[0] = myInnerColumns[1].textEditboxes.add({
    	  minWidth: 300,
    });
    
    var myResult = myDialog.show();    var myInput = myTextEditboxes[0].editContents;
    
    if (myResult == false) {
    	exit();
    }
    
    myDialog.destroy();    return myInput;

}


var myHyperlink;
var sourceText = '';
var destURL;


var mySel = getTextSelection();

if (mySel.constructor.name == "TextFrame") {
	error_exit("Please select some text and try again.");
}

var myDoc = (mySel.constructor.name == "Story") ? mySel.parent : mySel.parentStory.parent;

var myFoundHyperlinks = findHyperlinks (mySel);

// Check to see if there are already any hyperlinks in the selection.

if (myFoundHyperlinks.length > 0) {
	
	if (myFoundHyperlinks.length > 1) {
		error_exit ("The text you've selected contains more than one hyperlink. " + 
		            "Please select some text with one hyperlink, or no hyperlinks, and try again.");
	}
	
	// Now we know we're editing a hyperlink, not adding one.
	
	myHyperlink = myFoundHyperlinks[0];
	sourceText = myHyperlink.source.sourceText;
	
} else {
	
	// If we're creating a new hyperlink, then the selection cannot
	// be an insertion point:
	
	if (mySel.constructor.name == "InsertionPoint") {
		 error_exit("Please select some text and try again.");
	}
}	

var finished = false;

while (!finished) {
	var userInput = myDisplayDialog( sourceText );
	
	if (userInput && userInput.match( /[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/ ) ) {
		
		// If the person neglected the http://, add it
		
		myMatch = userInput.match( /^http\:\/\// );
		if (!myMatch) {
			userInput = "http://" + userInput;
		}
	  
		// If we're creating a link.

	  if (!myHyperlink) {
	  	  sourceText = myDoc.hyperlinkTextSources.add ( mySel );
	  		destURL = myDoc.hyperlinkURLDestinations.add();
	      myHyperlink = myDoc.hyperlinks.add( sourceText, destURL );
		    myHyperlink.properties = DEFAULT_HYPERLINK_PROPERTIES; 
		}; 

		myHyperlink.destination.destinationURL = userInput;
		
		finished = true;
		
	} else {
		alert ("Please type in a valid URL and try again.");
	}
};
		

/*

/(?i)\b((?:[a-z][\w-]+:(?:/{1,3}|[a-z0-9%])|
                                  www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)
                                  (?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+
                                  (?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|
                                  [^\s`!()\[\]{};:'".,<>?«»“”‘’]))/
                                  
                                        // found the preceding monstrosity on daringfireball. I trust them.	
                                 
                                  
                                  */