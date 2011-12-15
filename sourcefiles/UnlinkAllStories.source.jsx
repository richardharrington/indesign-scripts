var forEach = function( array, action ) {
    if (array.everyItem)  // It's an InDesign DOM collection
        array = array.everyItem().getElements();
        
    var result = [];
    for (var i = 0, len = array.length; i < len; i++ ) {
        result.push( action( array[i], i ));
    }
    return result;
};

Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
	if (arguments.length < 2) {
		var myShowingWindow = true; // default
	}
  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file(s).
  this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
  
  var doc = this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.
  
  // Restore user interaction
  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
  return doc;
}

Document.prototype.unlinkStories = function( doc ) {
    forEach( this.stories, function( story ) {
        if (story.lockState === LockStateValues.CHECKED_OUT_STORY || 
            story.lockState === LockStateValues.LOCKED_STORY) {
                
                if (!confirm( "The story beginning with\n" + story.contents.slice( 0, 20 ) + 
                              "\n\n" + "is not checked in. Do you want to unlink it anyway?")) {
                    return;
             }
        }
        if (story.itemLink && story.itemLink.isValid) {
            story.itemLink.unlink();
        }
    })
}

// ------------------------------------------------------------------------------------
	
// Get the folder where all the InDesign files are supposed to be.
var myFolder = Folder.selectDialog("Please select a folder containing all the InDesign files whose stories you want to unlink.");
if (myFolder == null) 
    exit ();
    
// Get the list of files in the folder.
var myFileArray = myFolder.getFiles("*");

// Remove all non-InDesign documents from the list.
for (i = myFileArray.length - 1; i >= 0; i--) {
	if (myFileArray[i].creator != "InDn") {
		myFileArray.splice( i, 1 );
	}
}
		
// Now open all the documents and kill the InCopy links.
var docs = app.openWithoutWarnings( myFileArray );
forEach( docs, function( doc ) {
    doc.unlinkStories();
    doc.close( SaveOptions.YES );
});

