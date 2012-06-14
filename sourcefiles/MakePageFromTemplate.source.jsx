// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


// CONFIG SETTINGS

var TEMPLATES_FOLDER_PATH = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/LAYOUTS - Indesign";
var ICML_FILES_FOLDER_PATH = "/Volumes/English/PRODUCTION FILES/CURRENT Incopy files and Indesign backups/icml files";
var THIS_WEEKS_ISSUE_FOLDER_PATH = "/Volumes/English/PRODUCTION FILES/CURRENT LAYOUTS-network";
var ICML_FOLDER_SUFFIX = " icml";
var NOTIFICATION_NAME = "Richard Harrington";
var NOTIFICATION_EMAIL = "harrington.richard@gmail.com";
var TECH_SUPPORT_CONTACT = "Elaine or Richard";
var COLLOQUIAL_NAME_OF_THIS_WEEKS_ISSUE_FOLDER = "CURRENT LAYOUTS";
var PUBLICATION_DAY = "Friday";
var WEEKS_IN_THE_FUTURE = 1;
var DOC_TYPES = {
  editorial: {
    filenameRoot: "Editorial", 
    templateFilename: "Daily News EDITORIAL.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
  news: {
    filenameRoot: "News", 
    templateFilename: "Daily News NEWS.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
  oped: {
    filenameRoot: "OpEd", 
    templateFilename: "Daily News OPED.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
  bestOfBlogs: {
    filenameRoot: "Best of Blogs", 
    templateFilename: "Daily News BEST of BLOGS.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
  fast: {
    filenameRoot: "Fast TEST DO NOT USE", 
    templateFilename: "Daily News FAST.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
  arts: {
    filenameRoot: "Arts", 
    templateFilename: "Daily News ARTS.indt",
    folioDatePlaceholderText: "Month XX, 2011",
  },
};


// CONSTANTS

var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAYS_REVERSE = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7};


// FUNCTIONS

//Open a document without dialog boxes popping up.
Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
	if (arguments.length < 2) {
		var myShowingWindow = true; // default
	}
  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.
  var savedInteractionLevel = this.scriptPreferences.userInteractionLevel;
  this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
  this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.
  // Restore user interaction
  app.scriptPreferences.userInteractionLevel = savedInteractionLevel;
}
	
// Figure out the cover date of the issue we want to create, which is WEEKS_IN_THE_FUTURE
// weeks after the PUBLICATION_DAY after the day the script is run.
Date.prototype.setNextIssueDate = function (publicationDay, weeksInTheFuture) {
	var publicationDayNumber = DAYS_REVERSE[publicationDay];
	var todaysDate = new Date();
	var daysToAdd = ((publicationDayNumber+7-todaysDate.getDay()) % 7) + (7*weeksInTheFuture);
	this.setDate (todaysDate.getDate() + daysToAdd);
}

Document.prototype.setFolio = function (docType, issueDate) {
	// THIS WILL EVENTUALLY DIFFERENTIATE BETWEEN DIFFERENT DOCTYPES.
	// RIGHT NOW WE'RE JUST GOING FOR THE EASY CASE, WHICH WILL
	// BE FOR MOST TYPES OF DOCUMENTS.
	app.changeTextPreferences = NothingEnum.nothing;
	app.findTextPreferences = NothingEnum.nothing;
	app.findChangeTextOptions.includeMasterPages = true;
	app.findTextPreferences.findWhat = docType.folioDatePlaceholderText;
	app.changeTextPreferences.changeTo = MONTHS[issueDate.getMonth()] + " " 
	                                   + issueDate.getDate() + ", " 
	                                   + issueDate.getFullYear();
	this.changeText();
	app.changeTextPreferences = NothingEnum.nothing;
	app.findTextPreferences = NothingEnum.nothing;
}
	

function add_leading_zeroes (myNum) {  // This version only works for one or two digit numbers
  if (myNum < 10) {
    return "0" + String (myNum);
  }
  return String (myNum);
}	

function error_exit (message) {
  if (arguments.length > 0) alert (unescape(message));
  exit();
} 



// MAIN BODY

main();

function main() {
  // THINGS THAT WILL BE EVENTUALLY DETERMINED BY A DIALOG BOX. THIS SECTION IS FOR TESTING PURPOSES ONLY.

  var myDocType = DOC_TYPES["fast"];
  // Figure out the issue date.
  var myIssueDate = new Date();
  myIssueDate.setNextIssueDate(PUBLICATION_DAY, WEEKS_IN_THE_FUTURE);
  
  // END OF THE SECTION THAT IS ONLY SETTING VARIABLES FOR TESTING, AND BEGINNING OF THE REAL MAIN BODY.
	app.openWithoutWarnings (TEMPLATES_FOLDER_PATH + "/" + myDocType.templateFilename);
	var myNewDoc = app.activeDocument;
	myNewDoc.setFolio (myDocType, myIssueDate);
}



	
