/* This script asks the user for a folder
   and unlinks all the stories in all the InDesign
   documents in that folder from their InCopy source files.
   
   This is useful when you have completed a project
   and published it, and you don't want any editors 
   messing with the InDesign documents in InCopy,
   under the mistaken impression that their changes will
   be included in the final version of the project.
   
*/

#include util.jsx

var Util = FORWARD.Util;

Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
    if (arguments.length < 2) {
        var myShowingWindow = true; // default
    }
    // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file(s).
    this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
  
    // This line may return an array or a single file
    var doc = this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.
  
    // Restore user interaction
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    return doc;
};

Document.prototype.unlinkStories = function( doc ) {
    var unlinkedSomeStories = false;
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
            unlinkedSomeStories = true;
        }
    });
    return unlinkedSomeStories;
};

var report = function( message, fileArray ) {
    var reportArray = [];
    if (fileArray.length > 0) {
        reportArray.push( message + "\n" );
        Util.forEach( fileArray, function( file ) {
            reportArray.push( unescape( file.name ));
        });
        reportArray.push( "\n" );
    }
    return reportArray;
};

// ------------------------------------------------------------------------------------

// First make sure there are no InDesign files open (easier that way.)
if (app.documents.length > 0) {
    alert("Please close all documents and start again.");
    exit();
}
    
// Get the folder where all the InDesign files are supposed to be.
var myFolder = Folder.selectDialog("Please select a folder containing all the " + 
                                   "InDesign files whose stories you want to unlink.");
if (myFolder == null) 
    exit ();
    
// Get the list of files in the folder.
var allFiles = myFolder.getFiles("*");
var ignoredFiles = [];
var examinedFiles = [];
var changedFiles = [];
var unchangedFiles = [];

var changedDocs = [];
var unchangedDocs = [];

for (i = allFiles.length - 1; i >= 0; i--) {
    if (allFiles[i].creator === "InDn" && allFiles[i].name.slice(-5) === ".indd") {
        examinedFiles.push( allFiles[i] );
    } else {
        ignoredFiles.push( allFiles[i] );
    }
}
        
// Now open all the documents and kill the InCopy links.
var docs = app.openWithoutWarnings( examinedFiles );
Util.forEach( docs, function( doc, i ) {
    if (doc.unlinkStories()) {
        changedFiles.push( examinedFiles[i] );
        doc.close( SaveOptions.YES );
    } else {
        unchangedFiles.push( examinedFiles[i] );
        doc.close( SaveOptions.NO );
    }
});

var myAlertText = ["Finished unlinking.\n\n"];

myAlertText = myAlertText.concat( report( "Stories were unlinked in the following files:", changedFiles ));
myAlertText = myAlertText.concat( report( "The following files were examined but either they had no linked " +
                                          "stories or you didn't want to unlink any of their stories:", unchangedFiles ));
myAlertText = myAlertText.concat( report( "The following files were ignored:", ignoredFiles ));

alert( myAlertText.join( "\n" ));