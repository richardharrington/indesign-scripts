/* This script asks the user for a folder
   and unlinks all the stories in all the InDesign
   documents in that folder from their InCopy source files.
   
   This is useful when you have completed a project
   and published it, and you don't want any editors 
   messing with the InDesign documents in InCopy,
   under the mistaken impression that their changes will
   be included in the final version of the project.
   
*/

// THINGS TO ADD AT WORK ON MONDAY 12/19/2011:
// 1. AN ALERT AT THE END TELLING YOU IT'S SUCCEEDED
// 2. A THING AT THE BEGINNING PREVENTING THE SCRIPT FROM
//    RUNNING IF THERE ARE ANY DOCUMENTS OPEN
// 3. A BETTER WAY OF DETERMINING IF A DOCUMENT IS AN INDESIGN DOCUMENT.


#include util.jsx

var Util = FORWARD.Util;

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
    Util.forEach( this.stories, function( story ) {
        if (story.lockState === LockStateValues.CHECKED_OUT_STORY || 
            story.lockState === LockStateValues.LOCKED_STORY) {
                
                if (!confirm( "The story beginning with the text\n\n" + story.contents.slice( 0, 20 ) + "\n\n" +
                              "on page " + story.textContainers[0].parentPage.name + "\n\n" + 
                              "of the document " + story.parent.name + "\n\n" + 
                              "is not checked in. Do you want to unlink it anyway? " +
                              "This will delete any changes that have been made by whoever has it checked out.")) {
                    return;
             }
        }
        if (story.itemLink && story.itemLink.isValid) {
            story.itemLink.unlink();
        }
    })
}

// ------------------------------------------------------------------------------------

// First make sure there are no InDesign files open (easier that way.)
if (app.documents.length > 0) {
    alert("Please close all documents and start again.");
    exit();
}
    
// Get the folder where all the InDesign files are supposed to be.
var myFolder = Folder.selectDialog("Please select a folder containing all the InDesign files whose stories you want to unlink.");
if (myFolder == null) 
    exit ();
    
// Get the list of files in the folder.
var myFileArray = myFolder.getFiles("*");

for (i = myFileArray.length - 1; i >= 0; i--) {
    if (myFileArray[i].creator != "InDn" || myFileArray[i].name.slice(-5) == ".idlk") {
        myFileArray.splice( i, 1 );
    }
}
        
// Now open all the documents and kill the InCopy links.
var docs = app.openWithoutWarnings( myFileArray );
Util.forEach( docs, function( doc ) {
    doc.unlinkStories();
    doc.close( SaveOptions.YES );
});

alert( "Finished unlinking stories" );

