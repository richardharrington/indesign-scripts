// Set to 6.0 scripting object model (Indesign CS4)app.scriptPreferences.version = 6.0;



// This script saves a file and then backs it up.

var BACKUP_FOLDER_PATH_NAME = "/Volumes/English/PRODUCTION FILES/CURRENT Incopy files and Indesign backups/indesign backups";

var myDoc = app.activeDocument;
var myDate = new Date();
var myBackupFilePathName = BACKUP_FOLDER_PATH_NAME + myDoc.name.replace(/\.indd$/, "_") + myDate.getTime() + ".indd";

var myBackupFile = new File (myBackupFilePathName);
var myCurrentFileName = myDoc.filePath + "/" + myDoc.name;
var myCurrentFile = new File (myCurrentFileName);

myDoc.save();
myDoc.close(SaveOptions.YES, myBackupFile);
open_with_no_warnings(myCurrentFile);

// Done.




function open_with_no_warnings (myFile, myShowingWindow) {  if (arguments.length < 2)     var myShowingWindow = true;  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;  app.open(myFile, myShowingWindow);  // defaults to opening a window with the document.  // Restore user interaction  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;}