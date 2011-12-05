// CONFIG SETTINGS

var EDITORIAL_TEMPLATE_PATH = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/LAYOUTS - Indesign/Editorial Gannett template.indt";
var FOLIO_DATE_PLACEHOLDER_TEXT = "Month XX, 2011";
var ICML_FILES_FOLDER_PATH = "/Volumes/English/PRODUCTION FILES/CURRENT Incopy files and Indesign backups/icml files";
var THIS_WEEKS_ISSUE_FOLDER_PATH = "/Volumes/English/PRODUCTION FILES/CURRENT LAYOUTS-network";


// CONSTANTS

var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];


// FUNCTIONS

//Open a document without dialog boxes popping up.
Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
	if (arguments.length < 2) {
		var myShowingWindow = true; // default
	}
  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.  var savedInteractionLevel = this.scriptPreferences.userInteractionLevel;
  this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;  this.open(myFile, myShowingWindow);  // defaults to NOT opening a window with the document.  // Restore user interaction  app.scriptPreferences.userInteractionLevel = savedInteractionLevel;}	
// Figure out what day is the next issue, which is dated a week from 
// the printing date.

Date.prototype.setNextIssueDate = function (publicationDay) {
	if (arguments.length < 1) {
		var publicationDay = 5; // defaults to Friday
	}
	var todaysDate = new Date();
	var daysToAdd = ((publicationDay+7-todaysDate.getDay()) % 7) + 7;
	this.setDate (todaysDate.getDate() + daysToAdd);
}


// MAIN BODY

main();function main() {  	app.openWithoutWarnings (EDITORIAL_TEMPLATE_PATH);
	var myNewEditorialPage = app.documents.lastItem();
	var myIssueDate = new Date();
	
	// Change the folio.
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;
	app.findTextPreferences.findWhat = FOLIO_DATE_PLACEHOLDER_TEXT;
	app.changeTextPreferences.changeTo = MONTHS[myIssueDate.getMonth()] + " " 
	                                   + myIssueDate.getDate() + ", " 
	                                   + myIssueDate.getFullYear();
	myNewEditorialPage.changeText();
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;


// Create the folder for the InCopy files if it doesn't already exist.

// Export the InCopy files.

// Save the file under its new name (after checking to see if it already exists).

}

	