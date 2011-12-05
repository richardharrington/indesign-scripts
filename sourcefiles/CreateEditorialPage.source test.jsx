// CONFIG SETTINGS

var EDITORIAL_PAGE_TEMPLATE_PATH = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/LAYOUTS - Indesign/Daily News EDITORIAL.indt";
var FOLIO_DATE_PLACEHOLDER_TEXT = "Month XX, 2011";
var ICML_FILES_FOLDER_PATH = "/Users/harrington/Documents/Current issue folder-local/TEST FOLDER/icml files";
var THIS_WEEKS_ISSUE_FOLDER_PATH = "/Users/harrington/Documents/Current issue folder-local/TEST FOLDER";
var EDITORIAL_PAGE_FILE_NAME_ROOT = "Editorial_TEST";
var ICML_FOLDER_SUFFIX = " icml";
var NOTIFICATION_NAME = "Richard Harrington";
var NOTIFICATION_EMAIL = "harrington.richard@gmail.com";
var TECH_SUPPORT_CONTACT = "Richard";
var SENDER_ACCOUNT = "joblo@joblo.com";
//var SENDER_ACCOUNT = "Production IMAP";
//var SENDER_ACCOUNT = "Harrington Forward e-mail";
var COLLOQUIAL_NAME_OF_THIS_WEEKS_ISSUE_FOLDER = "test CURRENT LAYOUTS";
var PUBLICATION_DAY = "Friday";
var WEEKS_IN_THE_FUTURE = 1;


// CONSTANTS

var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAYS_REVERSE = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7};


// FUNCTIONS

//Open a document without dialog boxes popping up.
Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
	if (arguments.length < 2) {
		var myShowingWindow = true; // default
	}
  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.  var savedInteractionLevel = this.scriptPreferences.userInteractionLevel;
  this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;  this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.  // Restore user interaction  app.scriptPreferences.userInteractionLevel = savedInteractionLevel;}	
// Figure out the cover date of the next issue, which is 
// a week after the Friday which follows the publication day.
Date.prototype.setNextIssueDate = function (publicationDay, weeksInTheFuture) {
	var publicationDayNumber = DAYS_REVERSE[publicationDay];
	var todaysDate = new Date();
	var daysToAdd = ((publicationDayNumber+7-todaysDate.getDay()) % 7) + (7*weeksInTheFuture);
	this.setDate (todaysDate.getDate() + daysToAdd);
}

function add_leading_zeroes (myNum) {  // This version only works for one or two digit numbers  if (myNum < 10) {    return "0" + String (myNum);  }  return String (myNum);}	function error_exit (message) {  if (arguments.length > 0) alert (unescape(message));  exit();} 


// MAIN BODY

main();function main() {
	  // Figure out the issue date.	var myIssueDate = new Date();
	myIssueDate.setNextIssueDate(PUBLICATION_DAY, WEEKS_IN_THE_FUTURE);
	
  // Check to see if a file with this name already exists either as
  // an open document or as a file on disk, and if not, 
  // Check to see if the user wants to create it at all.
  var myNewEditorialPageFile = new File ( THIS_WEEKS_ISSUE_FOLDER_PATH
                                    + "/"
                                    + EDITORIAL_PAGE_FILE_NAME_ROOT
                                    + "_"
                                    + add_leading_zeroes (myIssueDate.getMonth()+1)
                                    + add_leading_zeroes (myIssueDate.getDate())
                                    + ".indd" );
  
  // Exit if the file already exists
  if (myNewEditorialPageFile.exists) {
  	  error_exit ("The editorial page creation script has been run automatically and has "
  	             + "tried to create a new editorial page " 
  	             + "for next week, but you either already have one open or there's one on "
  	             + "the hard drive, so the script has determined "
  	             + "that it would be best all around to terminate itself, as you're playing with fire. \r\r"
  	             + "If you really think you know what you're doing and you want to create "
  	             + "a new editorial page after all, please delete or move "
  	             + "the current one first, then run the script again.");
  }
  // Exit if the user doesn't want to create it at all.
  else if (!confirm ("A script has just been run that is about to create a new editorial page titled " 
          + myNewEditorialPageFile.name + ". Do you want to do that?") ) {
    exit();
  }

	// Open a new editorial page from the template and change the folio.
	app.openWithoutWarnings (EDITORIAL_PAGE_TEMPLATE_PATH);
	var myNewEditorialPage = app.activeDocument;
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;
	app.findTextPreferences.findWhat = FOLIO_DATE_PLACEHOLDER_TEXT;
	app.changeTextPreferences.changeTo = MONTHS[myIssueDate.getMonth()] + " " 
	                                   + myIssueDate.getDate() + ", " 
	                                   + myIssueDate.getFullYear();
	myNewEditorialPage.changeText();
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;
	
  // Create the folder for the InCopy files if it doesn't already exist.
  var myIcmlFolderName = add_leading_zeroes (myIssueDate.getMonth()+1) 
                       + add_leading_zeroes (myIssueDate.getDate())
                       + ICML_FOLDER_SUFFIX;
  var myIcmlFolder = new Folder (ICML_FILES_FOLDER_PATH + "/" + myIcmlFolderName);
  if (!myIcmlFolder.exists) 
    myIcmlFolder.create();  

  // Export the InCopy files.
  var myStory;
  var myTimeStamp = add_leading_zeroes (myIssueDate.getHours()) 
                  + add_leading_zeroes (myIssueDate.getMinutes());
                  + add_leading_zeroes (myIssueDate.getSeconds());
  var myIcmlFileNameRoot = myNewEditorialPageFile.name.slice (0,-5) + "_" + myTimeStamp;
  
  var myStoryIndex = 0;
  for (var i=0; i<myNewEditorialPage.spreads.length; i++) {
  	var mySpread = myNewEditorialPage.spreads[i];
  	for (var j=0; j<mySpread.textFrames.length; j++) {
  		var myStory = mySpread.textFrames[j].parentStory;
  		myStoryIndex++;
	  	if (myStory.lockState == LockStateValues.NONE) {
	  	myStory.exportFile (ExportFormat.INCOPY_MARKUP, new File ( myIcmlFolder.fsName 
	  		                                                         + "/"
	  		                                                         + myIcmlFileNameRoot 
	  		                                                         + "_"
	  		                                                         + myStoryIndex
	  		                                                         + ".icml" ));
	  	}
  	}
  }
  
  // Save and close the document. 
	myNewEditorialPage.save (myNewEditorialPageFile);
	myNewEditorialPage.close ();
	
	// Alert the authorities.
	var mailScript = 'set recipientName to "' + NOTIFICATION_NAME + '"\r'
	               + 'set recipientAddress to "' + NOTIFICATION_EMAIL + '"\r'
	               + 'set senderAccount to "' + SENDER_ACCOUNT + '"\r'
	               + 'set theSubject to "' + MONTHS[myIssueDate.getMonth()] + ' ' + myIssueDate.getDate() + ' Editorial page created"\r'  
	               + 'set theContent to "The Editorial TEST page for the ' 
	                       + MONTHS[myIssueDate.getMonth()] + ' ' + myIssueDate.getDate() + ' issue ' 
	                       + 'has now been generated and is in ' + COLLOQUIAL_NAME_OF_THIS_WEEKS_ISSUE_FOLDER + ' and ready for editing. '
	                       + 'Contact ' + TECH_SUPPORT_CONTACT + ' with any questions."\r'
	               + 'tell application "Mail"\r'
//	               + '  activate\r'
	               + '  set theMessage to make new outgoing message with properties {subject:theSubject, content:theContent, visible:true, sender:senderAccount}\r'
	               + '  tell theMessage\r'
	               + '    make new to recipient with properties {name:recipientName, address:recipientAddress}\r'
	               + '    send\r'
	               + '  end tell\r'
	               + 'end tell';
	               $.writeln (mailScript);
  app.doScript (mailScript, ScriptLanguage.APPLESCRIPT_LANGUAGE);
  
  alert ("The editorial page has been successfully created and an email notification (in which " 
          + "the word 'editorial' was duly capitalized) has been delivered to the authorities. "
          + "You may now resume your drudgery.");

}



	
