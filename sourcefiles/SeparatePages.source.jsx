// Set to 6.0 scripting object model (Indesign CS4)app.scriptPreferences.version = 6.0;



// SeparatePages takes a reference to the current document and gets a page number from the user.// Then it does three things:  1) saves a backup copy of that document under a different name, // 2) saves a copy of the document with only that page, with a new name corresponding to the page number// entered by the user, and 3) saves a copy of the original document under its original name, with// that page number removed. Page.prototype.freezePageNumbering = function () {
  var myPage = this;
  var mySection = myPage.appliedSection;
  var myPageNum = mySection.pageNumberStart
                              + myPage.documentOffset
                              - mySection.pageStart.documentOffset;
  var mySectionPropertyList = [
                               "includeSectionPrefix",
                               "name",
                               "label",
                               "marker",
                               "pageNumberStyle",
                              ];
  var myNewSection;
  if (myPage == mySection.pageStart) {
    myNewSection = mySection;
  }
  else {
    myNewSection = app.activeDocument.sections.add(myPage);
  }
  var p;
  while (mySectionPropertyList.length) {
    p = mySectionPropertyList.pop();
    if (p!== null && p !== undefined) {
      myNewSection[p] = mySection[p];
    }
  }
  myNewSection.continueNumbering = false;
  myNewSection.pageNumberStart = myPageNum;
}

Spread.prototype.freezePageNumbering = 
Document.prototype.freezePageNumbering = function () {
	for (var i = 0; i < this.pages.length; i++) {
		this.pages[i].freezePageNumbering();
	}
}

// Not being used yet.
Application.prototype.openWithoutWarnings = function (myFile, myShowingWindow) {
	if (arguments.length < 2) {
		var myShowingWindow = true; // default
	}
  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.  this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;  this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.  // Restore user interaction  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;}	function open_with_no_warnings (myFile) {  // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file.  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;  app.open(myFile);  // Restore user interaction  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;}main();function main() {    var myDoc, myDocPath;  var myOldDocFile, myOldDocName;  var myBackupDocFile, myBackupDocName;  var myNewDocFile, myNewDocName;  var myPage, myNextPage;
  var myPageName, myPageNameForIndexing, myPagePrefix;  var myStory, myTextFrame;  var storyArray = [];  //Make certain that user interaction (display of dialogs, etc.) is turned on.  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;  if (app.documents.length == 0) error_exit ("Please open a document.");    myDoc = app.activeDocument;    if (myDoc.pages.length < 2) error_exit ("Please open a document with more than one page.");  if (myDoc.modified) error_exit ("Please save your document first, then run this script again.");  myPage = get_page_from_user(myDoc);
  myPageName = myPage.name;
  // This next part is so that we can pass a distinct 
  // argument to the pages.itemByName() method, which 
  // takes the full name of the page including hidden prefixes.
  if (myPage.appliedSection.includeSectionPrefix) {
  	myPageNameForIndexing = myPageName;
  }
  else {
  	myPageNameForIndexing = myPage.appliedSection.name + myPageName;
  }
  myDocPath = myDoc.filePath;  myOldDocFile = myDoc.fullName;  myOldDocName = myDoc.name;  // Create a backup of the document before we do anything, just in case of disaster.
  myBackupDocName = myOldDocName.replace (/\.indd$/, "") + "_BACKUP_MOVE_TO_OLD_" + myPageName + ".indd";  if (doc_is_open (myBackupDocName)) error_exit (myBackupDocName + " is open.  Please close it and try again.");   	  // The new document's name will be (essentially) "PG<page number>_<old document name>"
  myNewDocName = "PG" + add_leading_zeroes (myPageName) + "_" + myOldDocName.replace (/^news[_ ]*/i, "");  if (doc_is_open (myNewDocName)) error_exit (myNewDocName + " is open.  Please close it and try again.");   	  myBackupDocFile = new File (myDocPath + "/" + myBackupDocName);  if (!file_can_be_written(myBackupDocFile)) exit();   	  myNewDocFile = new File (myDocPath + "/" + myNewDocName);  if (!file_can_be_written(myNewDocFile)) exit();   		  try {    myDoc.save(myBackupDocFile);    myBackupDocFile.close();    myDoc.close();    open_with_no_warnings (myOldDocFile);  }  catch (myError) {    error_exit ("There was a problem saving or opening a file.\r\r" + myError);  }  myDoc = app.documents.itemByName (myOldDocName);   	  // Convert page numbers from metacharacters into Arabic numerals.  if (myPage != myDoc.pages.lastItem()) {    // next line uses the fact that documentOffset starts counting at 1 to get the next page, because nextItem() apparently doesn't work.    myDoc.pages[myPage.documentOffset+1].freezePageNumbering();
      }  myPage.freezePageNumbering();   		  try {    myDoc.save(myOldDocFile);    myDoc.save(myNewDocFile);    open_with_no_warnings (myOldDocFile);  }  catch (myError) {    error_exit ("There was a problem saving or opening a file.\r\r" + myError);  }   	  myOldDoc = app.documents.itemByName(myOldDocName);  myNewDoc = app.documents.itemByName(myNewDocName);
  // Remove separated page from main document.
  myOldDoc.pages.itemByName(myPageNameForIndexing).remove();
   	  // If the main document has been 
  // reduced to one page, make it a solid page 1 with a section start,
  // so that later the ReattachPages script will know it's a page 1.  if (myOldDoc.pages.length == 1)     myOldDoc.pages[0].freezePageNumbering();
  myOldDoc.save(myOldDocFile);  myOldDocFile.close();  
  // Remove all pages except the one we want from the new one-page document. 	  for (var p = myNewDoc.pages.length - 1; p >= 0; p--) {    if (myNewDoc.pages[p].name != myPageName) {      myNewDoc.pages[p].remove();    }  }  myNewDoc.save(myNewDocFile);  myNewDocFile.close();}function get_page_from_user (myDoc) {  var myInput;  var myTruncatedInput;  myInput = prompt("Which page should I separate out?", "");  if (myInput == null) exit();  myTruncatedInput = myInput.replace(/^\s*(\S+)\s*/, "$1");
  // We are choosing to use the following somewhat convoluted method 
  // of searching for page numbers because the method 
  // pages.itemByName() returns the name including the 
  // prefix, even if the prefix is hidden.  We don't want this.
  // (This is an inconsistency in InDesign, since the Page.name
  // property returns the page number WITHOUT hidden prefixes,
  // a fact which we make use of in the main function). 	var arrayOfPages = [];
 	for (var i = 0; i < myDoc.pages.length; i++) {
 		if (myDoc.pages[i].name == myTruncatedInput) {
 		  arrayOfPages.push(myDoc.pages[i]);
 		}
 	}
 	if (arrayOfPages.length < 1) {
 		error_exit ("Page " + myTruncatedInput + " doesn't exist. \r\r" +
 								"If you think you have received this error in error, " +
 								"perhaps you typed a prefix where there wasn't supposed " +
 								"to be one because the prefix on that page isn't set to print " +
 								"(e.g., you typed 'B4' instead of '4'), or you did the opposite " +
 								"and omitted a prefix that needed to be there.  " +
 								"Either way, fix it and try again.");
 	}
 	if (arrayOfPages.length > 1) {
 	  error_exit ("There's more than one page number " + 
 	               myTruncatedInput + ".  \r\r" +
 							  "Please make sure the page you want to " +
 							  "separate out has a distinct page number, " +
 							  "and try again.  You may be having an issue with " +
 							  "hidden prefixes too, which might cause two different pages " +
 							  "to show up in the PAGES panel as 'A7' & 'B7', but " +
 							  "both prefixes are set not to print.  This script treats " +
 							  "both those pages as page '7'.");
 	}
 	return arrayOfPages[0];}function add_leading_zeroes (myNum) {  // This version only works for one or two digit numbers  if (myNum < 10) {    return "0" + String (myNum);  }  return String (myNum);}function doc_is_open (docName) {  return (app.documents.itemByName(docName) != null) }function file_can_be_written (myFile) { // Takes a file object and its name and checks if it exists then checks if the user wants it overwritten  if (!myFile.exists) return true;  var docName = unescape (String (myFile).replace(/.*\//, ""));  return confirm (docName + " already exists.  Overwrite it?");}	function error_exit (message) {  if (arguments.length > 0) alert (unescape(message));  exit();} 