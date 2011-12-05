//The purpose of this script is to be basically to call ProcessText with the correct Story and Draft Type.// ---------- This top line only will change if we want to write the version for "Draft" mode.var myDraftType = "Final";// ------------------------------// DESCRIPTION of this next block: Open Doc with No Warningsif (app.version == 3) {	app.userInteractionLevel = UserInteractionLevels.neverInteract;} else {	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;}var myFile = File.openDialog ("Select a file" /*, "Documents:*.doc;*.docx, RTF files:*.rtf, All files:*", true */ ); var myErr = "";if (myFile != null) {

//	try {
	do {		mySel = app.selection[0];		var myFileName = (myFile.name);
		
		// Set the myParentStory variable so that we can then monitor and 
		// shut down the automatic feature where it 
		// creates a new link to stories that are placed from icml files.
		var myParentStory;
		switch (mySel.constructor.name) {			case "TextFrame":
				if (app.selection.length > 1) 
				  error_exit ("Please select some text or only one text frame, and try again.");
			case "Character":			case "Word":			case "TextStyleRange":			case "Line":			case "Paragraph":			case "TextColumn":			case "Text":			case "Cell":			case "Column":			case "Row":			case "Table":
			case "InsertionPoint":
					myParentStory = mySel.parentStory;
					break;			case "Story":					myParentStory = mySel;
					break;
			default:				//Something was selected, but it wasn't a text object, so search the document.				error_exit ("Please select a story, part of a story or a text frame, and start again.");
		}
		var myInitialLockState = myParentStory.lockState;
		if (myInitialLockState == LockStateValues.CHECKED_IN_STORY || myInitialLockState == LockStateValues.LOCKED_STORY) {
			error_exit ("Please check out the story you're trying to place text into, and try again.");
		}
		
		mySel.place(myFile);
		myFile.close();
		
		// Kill any linking that happened if myFile was an icml file
		// by checking to see if the lockState used to be NONE but has now changed:
		if (myInitialLockState == LockStateValues.NONE && myParentStory.lockState != LockStateValues.NONE) {
			myParentStory.itemLink.unlink();
		}
							myFileName = myFileName.toLowerCase();		var myFileNameArray = myFileName.split(".");		// If there is a four-digit date at the beginning of the filename array, remove it.		if (!isNaN(myFileNameArray[0])) {			myFileNameArray.shift();		}		if (myFileNameArray[0] == "oped") {			if (myFileNameArray[1] == "letters") {				var myKindOfFile = "letters";			}			else if (myFileNameArray[1] == "bintelbrief") {				var myKindOfFile = "bintelbrief";			}			else {				var myKindOfFile = "oped";			}		}		else if (myFileNameArray[0] == "shmooze") {			if (myFileNameArray[1].slice(0,10) == "correction")  {				var myKindOfFile = "corrections";			}			else if ((myFileNameArray[1] == "forverts") || (myFileNameArray[1] == "yiddish")) {				var myKindOfFile = "inthisweeks";			}			else {				var myKindOfFile = "shmooze";			}		}		else if (myFileNameArray[0].slice(0,4) == "edit") {			var myKindOfFile = "edit";		}		else if (myFileNameArray[0].slice(0,5) == "philo") {			var myKindOfFile = "arts";		}		else {			var myKindOfFile = myFileNameArray[0];		}				var myStoryType;		switch (myKindOfFile) {			case "inthisweeks" : 				myStoryType = "InThisWeeks";				break;			case "letters" : 				myStoryType = "Letters";				break;			case "shmooze" : 				myStoryType = "Shmooze";				break;			case "flb" : 				myStoryType = "ForwardLookingBack";				break;			case "arts" : 				myStoryType = "Arts";				break;			case "fast" : 				myStoryType = "Fast";				break;			case "oped" : 				myStoryType = "OpEd";				break;			case "bintelbrief" : 				myStoryType = "BintelBrief";				break;			case "corrections" : 				myStoryType = "Corrections";				break;			case "news" : 				myStoryType = "News";				break;			case "edit" : 				myStoryType = "Editorial";				break;			case "books" : 				myStoryType = "Arts";				break;			default : 				myStoryType = "MiscellaneousBodyCopy";		}		// write parameters		app.scriptArgs.set ("storyType", myStoryType);		app.scriptArgs.set ("draftType", myDraftType);		app.scriptArgs.set ("placingText", "yes");		var myScriptFile = myFindFile("ProcessText.source.jsx");
		app.doScript (myScriptFile, ScriptLanguage.javascript);	}
	
	while (false);
	//	catch (e) {//		myErr = e;//	}}if (app.version == 3) {	app.userInteractionLevel = UserInteractionLevels.interactWithAll;} else {	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;}if (myErr != "") {	alert(myErr);}

function error_exit (message) {    if (arguments.length > 0) alert (unescape(message));    exit();} function myFindFile(myFileName){	var myFile;	var myScriptFileName = getActiveScript();	//Get a file reference to the script.	var myScriptFile = File(myScriptFileName);	//Get a reference to the folder containing the script.	var myFolder = myScriptFile.parent;	//Look for the file name in the folder.	if(myFolder.getFiles(myFileName).length != 0){		myFile = myFolder.getFiles(myFileName)[0];	}	else{		myFile = null;	}	return myFile;}function getActiveScript() {    try {        var myScript = app.activeScript;    } catch(e) {        // we are running from the ESTK        var myScript = File(e.fileName);    }    return myScript;}