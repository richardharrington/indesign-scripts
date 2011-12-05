#include utilities.jsx

var DEFAULT_HYPERLINK_PROPERTIES = {
	  borderColor: [183, 27, 23],  // Burgundy, roughly.
  	borderStyle: HyperlinkAppearanceStyle.DASHED,
    width: HyperlinkAppearanceWidth.THIN,
    visible: true,
}

var mySource = getTextSelection();

var myDoc = (mySource.constructor.name == "Story") ? mySource.parent : mySource.parentStory.parent;

var myHyperlink;
var sourceText;
var destURL;

var myDisplayDialog = function() {
    var myDialog = app.dialogs.add({        name: "Type in a URL"    });
    
    var myOuterColumns = [];
    var myInnerColumns = [];
    var myOuterRows = [];
    var myBorderPanels = [];
    var myTextEditboxes = [];
    var myInput;
        myOuterColumns[0] = myDialog.dialogColumns.add();    myOuterRows[0] = myOuterColumns[0].dialogRows.add();    myBorderPanels[0] = myOuterRows[0].borderPanels.add();    myInnerColumns[0] = myBorderPanels[0].dialogColumns.add();    myInnerColumns[0].staticTexts.add({        staticLabel: "Please type in a URL:"    });
    
    myInnerColumns[1] = myBorderPanels[0].dialogColumns.add();    
    myTextEditboxes[0] = myInnerColumns[1].textEditboxes.add({
    	  minWidth: 300
    });
    
    var myResult = myDialog.show();    var myInput = myTextEditboxes[0].editContents;
    
    if (myResult == false) {
    	exit();
    }
    
    myDialog.destroy();    return myInput;

}

var userInput = myDisplayDialog();

if (userInput && userInput.match( /[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/ ) ) {
	
	// If the person neglected the http://, add it
	
	myMatch = userInput.match( /^http\:\/\// );
	if (!myMatch) {
		userInput = "http://" + userInput;
	}

	sourceText = myDoc.hyperlinkTextSources.add ( mySource );
	destURL = myDoc.hyperlinkURLDestinations.add();
	myHyperlink = myDoc.hyperlinks.add( sourceText, destURL );
	myHyperlink.destination.destinationURL = userInput;
	myHyperlink.properties = DEFAULT_HYPERLINK_PROPERTIES; 
	
} else {
	error_exit ("Please type in a valid URL and try again.");
}
	

/*

/(?i)\b((?:[a-z][\w-]+:(?:/{1,3}|[a-z0-9%])|
                                  www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)
                                  (?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+
                                  (?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|
                                  [^\s`!()\[\]{};:'".,<>?«»“”‘’]))/
                                  
                                        // found the preceding monstrosity on daringfireball. I trust them.	
                                 
                                  
                                  */