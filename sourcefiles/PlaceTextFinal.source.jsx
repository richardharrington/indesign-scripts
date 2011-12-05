// This script is called either 

// PlaceTextFinal.source.jsx 
// or
// PlaceTextRough.source.jsx 

// The purpose of this script is to call the ProcessText.source.jsx script 
// (which processes an Indesign/Incopy story for use in the print version of the Forward Newspaper)
// with the correct Story and Draft Type.
// The Draft type is determined by the name of this script file, either "Final" or "Rough."
// The Story type is determined by the name of the text file that will be placed.

// If you make changes to this script, save it as both "PlaceTextFinal.source.jsx" 
// and "PlaceTextRough.jsx".

// Determine Draft type by reading the name of this script file.
var myDraftType = getActiveScript().name.slice(9,14);

// Disable warnings while we're placing the text file.if (app.version == 3) {	app.userInteractionLevel = UserInteractionLevels.neverInteract;} else {	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;}

var myFile = File.openDialog ("Select a file" /*, "Documents:*.doc;*.docx, RTF files:*.rtf, All files:*", true */ ); var myErr = "";if (myFile != null) {
	try {
		
		mySel = app.selection[0];		var myFileName = (myFile.name);
		
		// Set the myParentStory variable so that we can then monitor and 
		// shut down the automatic feature where if a story is placed from an icml
		// file, Indesign creates a new link to that icml file. We don't want that, 
		// because we want to be able to export the story to a new icml file 
		// in a hidden location, so that the editors now only have access to this
		// story by going through the Indesign file where it's placed on the page.
		// This will reduce confusion and the potential for mishaps.
		var myParentStory;
		switch (mySel.constructor.name) {			case "TextFrame":
				if (app.selection.length > 1) 
				  error_exit ("Please select some text or only one text frame, and try again.");
			case "Character":			case "Word":			case "TextStyleRange":			case "Line":			case "Paragraph":			case "TextColumn":			case "Text":			case "Cell":			case "Column":			case "Row":			case "Table":
			case "InsertionPoint":
					myParentStory = mySel.parentStory;
					break;			case "Story":					myParentStory = mySel;
					break;
			default:				// Something was selected, but it wasn't a text object or a text frame, so exit.				error_exit ("Please select a story, part of a story or a text frame, and start again.");
		}
		
		// Get the lockState of the story on the page before placing the file, to 
		// Determine whether the story was already linked to an icml file or not.
		var myInitialLockState = myParentStory.lockState;
		if (myInitialLockState == LockStateValues.CHECKED_IN_STORY || myInitialLockState == LockStateValues.LOCKED_STORY) {
			error_exit ("Please check out the story you're trying to place text into, and try again.");
		}
		
		mySel.place(myFile);
		myFile.close();
		
		// Kill any linking that happened if myFile was an icml file.
		// We do this by first checking to see if the lockState used to be NONE 
		// (i.e., the story did not start out linked to any icml file) but has now changed:
		if (myInitialLockState == LockStateValues.NONE && myParentStory.lockState != LockStateValues.NONE) {
			myParentStory.itemLink.unlink();
		}
	  
	  // Now the nitty gritty of trying to determine the Story type based on the filename
	  // of the imported file. The editors and the copy editor generally submit the files
	  // in the form <mmdd.section_name.story_name.other_stuff.doc> where mmdd is month and day.		myFileName = myFileName.toLowerCase();		var myFileNameArray = myFileName.split(".");		// If there is a four-digit date at the beginning of the filename array, remove it.		if (!isNaN(myFileNameArray[0])) {			myFileNameArray.shift();		}
		// Adjust the section name in the filename a bit, if it needs it.		if (myFileNameArray[0] == "oped") {			if (myFileNameArray[1] == "letters") {				var myKindOfFile = "letters";			}			else if (myFileNameArray[1] == "bintelbrief") {				var myKindOfFile = "bintelbrief";			}			else {				var myKindOfFile = "oped";			}		}		else if (myFileNameArray[0] == "shmooze") {			if (myFileNameArray[1].slice(0,10) == "correction")  {				var myKindOfFile = "corrections";			}			else if ((myFileNameArray[1] == "forverts") || (myFileNameArray[1] == "yiddish")) {				var myKindOfFile = "inthisweeks";			}			else {				var myKindOfFile = "shmooze";			}		}		else if (myFileNameArray[0].slice(0,4) == "edit") {			var myKindOfFile = "edit";		}		else if (myFileNameArray[0].slice(0,5) == "philo") {			var myKindOfFile = "arts";		}		else {			var myKindOfFile = myFileNameArray[0];		}				// Assign the Story type based on the section name in the filename.
		var myStoryType;		switch (myKindOfFile) {			case "inthisweeks" : 				myStoryType = "InThisWeeks";				break;			case "letters" : 				myStoryType = "Letters";				break;			case "shmooze" : 				myStoryType = "Shmooze";				break;			case "flb" : 				myStoryType = "ForwardLookingBack";				break;			case "arts" : 				myStoryType = "Arts";				break;			case "fast" : 				myStoryType = "Fast";				break;			case "oped" : 				myStoryType = "OpEd";				break;			case "bintelbrief" : 				myStoryType = "BintelBrief";				break;			case "corrections" : 				myStoryType = "Corrections";				break;			case "news" : 				myStoryType = "News";				break;			case "edit" : 				myStoryType = "Editorial";				break;			case "books" : 				myStoryType = "Arts";				break;			default : 				myStoryType = "MiscellaneousBodyCopy";		}		// write parameters		app.scriptArgs.set ("storyType", myStoryType);		app.scriptArgs.set ("draftType", myDraftType);
		// This third parameter is to tell the called script that it is being called
		// to process a file that has just been imported. The reason for this is that
		// if we're importing a file, we want to eliminate all the Word hyperlinks
		// which have already been converted into InDesign hyperlinks by the import process,
		// while if we're just processing a story that's already there, we probably
		// don't want to eliminate the existing InDesign hyperlinks.		app.scriptArgs.set ("placingText", "yes");		var myScriptFile = myFindFile("ProcessText.source.jsx");
		app.doScript (myScriptFile, ScriptLanguage.javascript);	}
	
	catch (e) {		myErr = e;	}}


// Restore warnings after placing the text file.if (app.version == 3) {	app.userInteractionLevel = UserInteractionLevels.interactWithAll;} else {	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;}if (myErr != "") {	alert(myErr);}

function error_exit (message) {    if (arguments.length > 0) alert (unescape(message));    exit();} function myFindFile(myFileName){	var myFile;	var myScriptFileName = getActiveScript();	//Get a file reference to the script.	var myScriptFile = File(myScriptFileName);	//Get a reference to the folder containing the script.	var myFolder = myScriptFile.parent;	//Look for the file name in the folder.	if(myFolder.getFiles(myFileName).length != 0){		myFile = myFolder.getFiles(myFileName)[0];	}	else{		myFile = null;	}	return myFile;}function getActiveScript() {    try {        var myScript = app.activeScript;    } catch(e) {        // we are running from the ESTK        var myScript = File(e.fileName);    }    return myScript;}