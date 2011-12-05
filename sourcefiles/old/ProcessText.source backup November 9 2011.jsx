// ProcessText.source.jsx

// This script takes a story in InDesign or InCopy and processes it into
// one of a number of formats for different types of stories in the Forward newspaper.
// It does a few basic things like getting rid of extra spaces and line breaks and styling
// italic sections, but it also it tries to figure out more specific things like styling bylines, 
// datelines, etc. Sometimes it's wrong, but it usually gets us 90% of the way there.

// The script can handle hyperlinks and italics in markdown format, and a couple of
// other features of markdown. It CANNOT handle
// markdown bolding. We rarely use bold, so we just have to keep an eye out for double asterisks
// when we're looking over the text, and convert them to bold manually (or using the InDesign
// user interface's GREP search function).

// -------------------------------------------------------------------------
// The function contained in the following library,
// markdownToIndesign(), is given an object containing a block// of text, and it finds all the hyperlinks inside the text// that are in markdown format and converts them to // InDesign Hyperlink format (i.e., it removes each URL from// the text itself and puts it into an InDesign Hyperlink).#include MarkdownToIndesign.library.jsx


// If the scriptArg "draftType" is set, then this was run by PlaceText,
// and both "draftType" and "storyType" should be set.
// Otherwise this script is on its own and we'll ask the user what they 
// want for both Draft type and Story type

var myDraftType = app.scriptArgs.get("draftType");
var myStoryType = app.scriptArgs.get("storyType");

// If these assignments didn't work,
// then this script has been run standalone,
// and we need to ask the user what they want.
if (!myDraftType || !myStoryType) {
	var myDialogResult = myDisplayDialog();
	myDraftType = myDialogResult.draftType;
	myStoryType = myDialogResult.storyType;
}

function myDisplayDialog(){
	var myObject;
	var myDialog = app.dialogs.add({name:"ProcessText"});
	var myOuterColumn = myDialog.dialogColumns.add();
	var myOuterRow = myOuterColumn.dialogRows.add();

	var myFirstBorderPanel = myOuterRow.borderPanels.add();
	var myFirstInnerColumn = myFirstBorderPanel.dialogColumns.add();
	myFirstInnerColumn.staticTexts.add({staticLabel:"Story type:"});
	var myStoryTypeRangeButtons = myFirstBorderPanel.radiobuttonGroups.add();
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Arts"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Books"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Corrections"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Editorial"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Fast"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"ForwardLookingBack"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"InThisWeeks"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Letters"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"MiscellaneousBodyCopy"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"News", checkedState:true});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"OpEd"});
	myStoryTypeRangeButtons.radiobuttonControls.add({staticLabel:"Shmooze"});
	
	var mySecondBorderPanel = myOuterRow.borderPanels.add();
	var mySecondInnerColumn = mySecondBorderPanel.dialogColumns.add();
  mySecondInnerColumn.staticTexts.add({staticLabel:"Draft type:"});
  var myDraftTypeRangeButtons = mySecondBorderPanel.radiobuttonGroups.add();
	myDraftTypeRangeButtons.radiobuttonControls.add({staticLabel:"Final", checkedState:true});
	myDraftTypeRangeButtons.radiobuttonControls.add({staticLabel:"Rough"});

	var myResult = myDialog.show();
	if (myResult == false) 
	  exit();
	var myReturnResult = {}; 
	myReturnResult.storyType = myStoryTypeRangeButtons.radiobuttonControls[myStoryTypeRangeButtons.selectedButton].staticLabel;
	myReturnResult.draftType = myDraftTypeRangeButtons.radiobuttonControls[myDraftTypeRangeButtons.selectedButton].staticLabel;
	myDialog.destroy();
	return myReturnResult;
}


// color definitions

var ForwardColors = {
	RoughTextColor: {
		name: "C=88 M=11 Y=1 K=0", 
		space: ColorSpace.CMYK,
		colorValue: [88, 11, 1, 0], 
	}
}

// paragraph style definitionsvar CharStyle = {
	Dateline: "dateline",
	BylineDateline: "byline dateline",
}
function ForwardParagraphStyle() {}ForwardParagraphStyle.prototype.DefaultCopy = "body copy";ForwardParagraphStyle.prototype.FirstLine = "body copy first graph";ForwardParagraphStyle.prototype.Byline = "BYLINE glypha";ForwardParagraphStyle.prototype.BylineSlug = "Byline SLUG";ForwardParagraphStyle.prototype.FrenchByline = "french byline";ForwardParagraphStyle.prototype.Shirttail = "shirttail slimbach";ForwardParagraphStyle.prototype.Blockquote = "ARTS blockquote multi-para (middle)";ForwardParagraphStyle.prototype.Poetry = "ARTS poetry multi-para (middle)";var InThisWeeks = new ForwardParagraphStyle();InThisWeeks.DefaultCopy = "In This Week's list";InThisWeeks.FirstLine = "In This Week's list";var Letters = new ForwardParagraphStyle();Letters.DefaultCopy = "letters";Letters.FirstLine = "letters";Letters.HedFirst = "letters hed first";Letters.Hed = "letter hed";Letters.Sig = "letter signature";Letters.Address = "letters address";var Shmooze = new ForwardParagraphStyle();Shmooze.DefaultCopy = "shmooze body copy rag";Shmooze.FirstLine = "shmooze body first";var ForwardLookingBack = new ForwardParagraphStyle();ForwardLookingBack.DefaultCopy = "*FLB Body Copy";ForwardLookingBack.FirstLine = "*FLB Body Copy";ForwardLookingBack.YearsAgo = "*FLB new years ago";ForwardLookingBack.InTheForward = "*flb in the forward";var Arts = new ForwardParagraphStyle();Arts.FirstLine = "ARTS first graph med cap copy";Arts.BookTitle = "ARTS book 1.title";Arts.BookAuthor = "ARTS book 2.author";Arts.BookPublisher = "ARTS book 3.publisher";var Books = Arts;var Fast = new ForwardParagraphStyle();Fast.FirstLine = "ARTS first graph med cap copy";var OpEd = new ForwardParagraphStyle();OpEd.FirstLine = "OPED first graph dropcap";OpEd.Byline = "OPED byline subhed rule";var Corrections = new ForwardParagraphStyle();Corrections.FirstLine = "body copy";var BintelBrief = new ForwardParagraphStyle();BintelBrief.FirstLine = "body copy";var Editorial = new ForwardParagraphStyle();Editorial.DefaultCopy = "Editorial body copy";Editorial.Hed = "EDITORIAL HED w/RULE";Editorial.FirstLine = "Editorial drop cap";var News = new ForwardParagraphStyle();var MiscellaneousBodyCopy = new ForwardParagraphStyle();// Man, this script is getting squirrelly.  "datelineIndex" is a global variable// that probably should be tied to a byline object or something, but it's not.// Later, it sets the character index of the dateline within the byline paragraph.// Most bylines don't have datelines.  Hence the initial value of -1 to indicate nonexistence.var datelineIndex = -1;function error_exit (message) {    if (arguments.length > 0) alert (unescape(message));    exit();} // Searches a string for the occurrence of any one or more strings from an array of strings.function containsAny (myStr, mySearchWords, caseSensitive) {	if (arguments.length < 2) 	    var caseSensitive = false; // defaults to case-insensitive 	if (!caseSensitive)    	myStr = myStr.toLowerCase();	var i;	var mySearchWord;	for (i=0; i < mySearchWords.length; i++) {	    mySearchWord = mySearchWords[i];	    if (!caseSensitive)	        mySearchWord = mySearchWord.toLowerCase();		if (myStr.search(mySearchWord) != -1) {			return true;		}	}	return false;}Character.prototype.multiChangeGrep = Word.prototype.multiChangeGrep = TextStyleRange.prototype.multiChangeGrep = Line.prototype.multiChangeGrep = Paragraph.prototype.multiChangeGrep = TextColumn.prototype.multiChangeGrep = Text.prototype.multiChangeGrep = Cell.prototype.multiChangeGrep = Column.prototype.multiChangeGrep = Row.prototype.multiChangeGrep = Table.prototype.multiChangeGrep = Story.prototype.multiChangeGrep = TextFrame.prototype.multiChangeGrep = XMLElement.prototype.multiChangeGrep = Document.prototype.multiChangeGrep = Application.prototype.multiChangeGrep = function (findChangeArray) {  var findChangePair;  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    app.findGrepPreferences.findWhat = findChangePair.find;    app.changeGrepPreferences.changeTo = findChangePair.change;    this.changeGrep();  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  }}			// multiReplace() is intended to take // an array of find/change pairs, the first// element of each of which will be converted// first into a RegExp, if it comes in as a string.String.prototype.multiReplace = function (findChangeArray) {  var myFind, myChange;  var findChangePair;  var str = this;  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    myFind = findChangePair.find;    myChange = findChangePair.change;    if (myFind.constructor.name == "String") {      myBefore = RegExp (myFind);    }     str = str.replace (myFind, myChange)  }  return str;}main();function main(){	var myObject;	//Make certain that user interaction (display of dialogs, etc.) is turned on.	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;	if (app.documents.length == 0) error_exit ("No documents are open.  Please open a document and try again.");	if (app.selection.length == 0) error_exit ("Please select something and try again.");	switch(app.selection[0].constructor.name){		case "Character":		case "Word":		case "TextStyleRange":		case "Line":		case "Paragraph":		case "TextColumn":		case "Text":		case "Cell":		case "Column":		case "Row":		case "Table":
		  // This if statement is necessary because of an apparent bug that
		  // will cause the program to crash later if the selection is a Text
		  // object and not a Story object, when you have the whole story selected.
		  if (app.selection[0].length == app.selection[0].parentStory.length) {
		  	myObject = app.selection[0].parentStory;
		  }
		  else {
		  	myObject = app.selection[0];
		  }
		  break;
		case "Story":			myObject = app.selection[0];			break;		// If they've selected a text frame, make sure they've selected only one, but if they have selected only one,		// then both a text frame and an insertion point have the same result:  myObject = parentStory.		case "TextFrame":		    if (app.selection.length > 1) error_exit ("If you're going to select a text frame, "		                                    + "please select that text frame and nothing else, and try again.");		case "InsertionPoint":		    myObject = app.selection[0].parentStory;		    break;		default:			//Something was selected, but it wasn't a text object, so search the document.			error_exit ("Please select a story, part of a story or a text frame, and start again.");	}	if (myObject == null) error_exit ("There's been an error of indeterminate nature.  Probably best to blame the programmer.");		myTextCleanup (myObject);    app.scriptArgs.clear();}function myTextCleanup(myObject){
	
	var myParentStory;
	if (myObject.constructor.name == "Story")
		myParentStory = myObject;
	else 
	  myParentStory = myObject.parentStory;		var myFindChangeListFile;	switch (myStoryType) {		case "Arts" :		case "Books" :		case "Fast" :		case "OpEd" :		case "Corrections" :		case "News" :		case "BintelBrief" :			myFindChangeListFile = "JSFindChangeListMiscellaneousBodyCopy.txt";			break;		default :			myFindChangeListFile = "JSFindChangeList" + myStoryType + ".txt";	}	
	// Hide the pseudo-html tags that come in from stories that are cut
	// and pasted from the back end of our website, by turning them into notes.
  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};
  
  // Remove hard returns from block-level html.
  for (var i=0; i<myObject.paragraphs.length; i++) {
  	var myParagraph = myObject.paragraphs[i];
//  	app.findGrepPreferences.findWhat = "\\s*?$";
//    app.changeGrepPreferences.changeTo = "";
//    myParagraph.changeGrep();
//  	app.findGrepPreferences.findWhat = "^\\s*?";
//    app.changeGrepPreferences.changeTo = "";
//    myParagraph.changeGrep();
//    app.changeGrepPreferences = NothingEnum.nothing;//    app.findGrepPreferences = NothingEnum.nothing;  	if (myParagraph.characters[0].contents == "<" && myParagraph.characters[-2].contents != ">") {
  		myParagraph.characters[-1].contents = " ";
  		i--;
  	}
  }
  	  
  // Shore up whitespace at the beginning and the end of block-level html.
	app.findGrepPreferences.findWhat = "^\\s*?(<.*?>)\\s*?$";
	app.changeGrepPreferences.changeTo = "$1";
	var myResults = myObject.changeGrep();
  app.changeGrepPreferences = NothingEnum.nothing;	
	//Convert block-level html into Notes and move them to the beginning
	//of the previous line.
	
	app.findGrepPreferences.findWhat = "^<.*?>$";
	myResults = myObject.findGrep();
	for (var i=myResults.length-1; i>=0; i--) {
    var myIndex = myResults[i].index;
    myResults[i].convertToNote();
    if (myIndex > 0) {
		  myParentStory.characters[myIndex-1].contents = "";
    }
    // Else kill the paragraph mark at the beginning of the first
    // paragraph, which is now just a note. Take care of the extra trailing
    // paragraph returns first.
    else {
    	while (myParentStory.paragraphs[1].length == 1) {
    		myParentStory.paragraphs[1].characters[-1].contents = "";
    	}
    	myParentStory.paragraphs[0].characters[-1].contents = "";
    }
	}
	
  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;
  
  // Add a byline at the beginning if there is a contact line at the end with asterisks around it,
  // which would indicate that it was cut and pasted from the web, and thus had 
  // no automatic byline. (This is just a helpful extra. We should remove it if it's squirrelly.
	app.findGrepPreferences.findWhat = "^\\*Contact (.*?) at .*?@forward.com\\*";
	myResults = myObject.findGrep();
	if (myResults && myResults.length > 0) {
		var myNewByline = myResults[0].contents.match (/\*Contact (.*?) at .*?@forward.com\*/)[1];
		myObject.paragraphs[0].insertionPoints[0].contents = "By " + myNewByline + "\r\r";
	}
  app.findGrepPreferences = NothingEnum.nothing;
  
	// Now deal with datelines	styleDateline (myObject);
	// Now do the main cleanup.	myFindChangePass(myObject, "JSFindChangeListGeneral.txt", "TextProcessSupport");	myFindChangePass(myObject, myFindChangeListFile, "TextProcessSupport");
	// Get rid of extra paragraph breaks at beginning and end.
	while (myObject.characters[0].contents == "\r") {		myObject.characters[0].remove();	}	while (myObject.characters[-1].contents == "\r") {		myObject.characters[-1].remove();	}	  
  mySpecializedChanges(myObject, myStoryType);	
	// Turn text blue if this is supposed to be rough copy.
	if (myDraftType == "Rough") {
		if (app.colors.item (ForwardColors.RoughTextColor.name) == null) {           app.colors.add (ForwardColors.RoughTextColor);    }		myFindChangePass(myObject, "JSFindChangeListRough.txt", "TextProcessSupport");	}}	// function removeCharStyle both de-applies the style from the all text which has// it applied (leaving that text styled "none") and then removes the style.function removeCharStyle (myDoomedCharStyleName) {	var myDoomedCharStyle = app.activeDocument.characterStyles.item(myDoomedCharStyleName);	if (myDoomedCharStyle != null) {		var myTempNullCharStyleName = "tempNull";		var myTempNullCharStyle = app.activeDocument.characterStyles.item(myTempNullCharStyleName);		if (app.activeDocument.characterStyles.item(myTempNullCharStyleName) != null) {			app.activeDocument.characterStyles.item(myTempNullCharStyleName).remove();		}		var myTempNullCharStyle = app.activeDocument.characterStyles.add({name:myTempNullCharStyleName});		myDoomedCharStyle.remove(myTempNullCharStyle);		myTempNullCharStyle.remove();	}}// REFACTORING NOTE: The next two convoluted functions are left over from the version 
// I wrote for CS2, before InDesign had good GREP search capability.
// Probably should be rewritten using the Regexp engine.function findByline (myObject) {	var i;	var j;	var k;	var myParagraph;	var myWord;	var foundByline;	var myCharacter;	var myCharacterStyles = app.activeDocument.characterStyles;		foundByline = false;	for (i = myObject.paragraphs.length-1; i >= 0; i--) {		myParagraph = myObject.paragraphs[i];		if ( (myParagraph.words.length > 0) && ( (myParagraph.words[0].contents == "By")												|| (myParagraph.characters[0].contents == SpecialCharacters.emDash)												|| (myParagraph.characters[0].contents == SpecialCharacters.enDash)												|| (myParagraph.characters[0].contents == "-") ) ) {			foundByline = true;						// The following for loop will eliminate cases of an actual sentence starting with the word "By."			// It will do this by making sure that all words are either capitalized or they are the word "and,"			// which sometimes occurs in a byline.			for (j=0; j < myParagraph.words.length; j++) {				myWord = myParagraph.words[j];								// Skip over quotation marks at the beginning of the word, which would 				// mess up the .toUpperCase() method because they are not strings in InDesign but rather "special characters."				// At the end of this loop, myCharacter should be the first letter in the sentence.				for (k=0; k < myWord.length; k++) {					myCharacter = myWord.characters[k];					if (typeof myCharacter.contents == "string") break;				}				if ((myCharacter.contents.toUpperCase() != myCharacter.contents) && (myWord.contents != "and")) {  // Good place to put in support for multiple names					foundByline = false;					break;				}			}			if (foundByline) {				return myParagraph;			}		}	}}			// styleDateline.datelineIndex = -1;function styleDateline (myObject) {	var k;	var myIndex;	var myByline;	var myCharacterStyles = app.activeDocument.characterStyles;		// Fix the situation where we have two character style sheets in the various documents that do exactly the 	// same thing:  dateline and byline dateline	if (myCharacterStyles.item(CharStyle.BylineDateline) != null) {		// If the byline dateline character style exists but not dateline, change its name to dateline		if (myCharacterStyles.item(CharStyle.Dateline) == null) {			myCharacterStyles.item(CharStyle.BylineDateline).name = CharStyle.Dateline;		}		// If both exist, remove byline dateline and replace all occurrences with dateline		else {			myCharacterStyles.item(CharStyle.BylineDateline).remove (myCharacterStyles.item(CharStyle.Dateline));		}	}		if (myByline = findByline (myObject)) {		myIndex = myByline.contents.search('  ');		if (myIndex != -1) {			for (k = myIndex; k < myByline.length; k++) {				myByline.characters[k].appliedCharacterStyle = CharStyle.Dateline;			}		}		// styleDateline.datelineIndex = myIndex;		datelineIndex = myIndex;		return;	}					}	function mySpecializedChanges (myObject, myStoryType) {	var i, j, k;	var myDoc;	var myParagraph, myNextParagraph, myPreviousParagraph;
	var mySourceText;	var myWord;	var myFirstCharacter;	var foundDateline, foundByline, foundRegularByline, foundFrenchByline;	var myIndex;	var myAuthorName, myAuthorNameBegin, myAuthorNameEnd;	var myHyperlink;	var myObjectParentStory, myHyperlinkParentStory;	var myFoundHyperlink, myFoundHyperlinks, myHyperlinkSourceText, myHyperlinkDestURL;	var myStoryStyle = eval(myStoryType);
	var nextParagraphIsBlockquote;
	
	
	// First things first:  Kill all hyperlinks, if they're coming in from Word!	// (I haven't figured out how to remove only the ones	// in a particular block of text yet, but I will.	// We never want any hyperlinks anyway, so it 	// doesn't matter too much.		// Once we've gotten rid of the actual hyperlink,	// we have to get rid of the hyperlink character style,	// which has to be done by hand here rather than using a	// JSFindChange.txt file, because we can't remove a character	// style, we have to make a fake one first.  Irritating. 		if (app.scriptArgs.get("placingText") == "yes") {	    	myDoc = app.activeDocument;    	    	if (myObject.constructor.name == "Story") {    		myObjectParentStory = myObject;    	}    	else {    		myObjectParentStory =  myObject.parentStory;    	}    		    	for (i = myDoc.hyperlinks.length-1; i >= 0; i--) {    		myHyperlink = myDoc.hyperlinks[i];    		if (myHyperlink.source.sourceText.constructor.name == "Story") {    			myHyperlinkParentStory = myHyperlink.source.sourceText;    		}    		else {    			myHyperlinkParentStory = myHyperlink.source.sourceText.parentStory;    		}    		// Now comes the actual elimination of the hyperlink.	    		if (myHyperlinkParentStory == myObjectParentStory) {    			myHyperlink.source.remove();    		}    	}    	    	removeCharStyle("Hyperlink");    	removeCharStyle("Internet link");    	removeCharStyle("Internet Link");	}	// Deal with Bylines and first lines, and set the AuthorName if there is one.		foundByline = false;	foundRegularByline = false;	foundFrenchByline = false;	foundByline = (myParagraph = findByline(myObject));  // If byline is found, sets "foundByline" to true and "myParagraph" to the paragraph containing the byline.		if (foundByline && (myParagraph.words[0].contents == "By"))		foundRegularByline = true;	else		foundFrenchByline = true;		if (foundByline) {		// THIS IS ALSO NOT SAFE.  THE PROGRAM WILL PROBABLY HAVE TAKEN CARE OF SPACES		// AT THE END OF THE PARAGRAPH, BUT BETTER JUST TO SAY myAuthorNameEnd IS AT THE END OF THE 		// LAST WORD, NOT THE END OF THE PARAGRAPH.		myAuthorNameEnd = myParagraph.length-1;			if (foundRegularByline) {  // and not French byline			myParagraph.appliedParagraphStyle = myStoryStyle.Byline;			myNextParagraph = myObject.paragraphs.nextItem(myParagraph);			if (myNextParagraph != null) {				myNextParagraph.appliedParagraphStyle = myStoryStyle.FirstLine;			}			myAuthorNameBegin = ("By ").length;  			// Theoretically, datelines should only occur in regular bylines.			// Check if there's a dateline and if there is, add back in the 
			// extra space before it that was taken out by the automatic search.			if (datelineIndex != -1) {				myAuthorNameEnd = datelineIndex - 1;				myParagraph.insertionPoints[datelineIndex].contents = " ";			}		}				if (foundFrenchByline) {  // and not regular byline			myParagraph.appliedParagraphStyle = myStoryStyle.FrenchByline;			//  THIS NEXT LINE IS TOTALLY INSANE AND WILL CAUSE ALL KINDS OF PROBLEMS.  			//  CHANGE IT SO THAT myAuthorNameBegin STARTS WITH THE BEGINNING OF THE FIRST			//  WORD IN THE PARAGRAPH, NOT AN ARBITRARY NUMBER OF CHARACTERS IN (YOU NEVER			//  KNOW HOW MANY SPACES SOMEONE IS GOING TO TYPE AFTER THE DASH -- THE PROGRAM			//  WILL HAVE TAKEN CARE OF REDUCING IT TO ONE IF IT'S MORE THAN ONE, BUT NOTHING			//  WILL HAVE BEEN DONE IF THERE ARE NO SPACES AT ALL.			myAuthorNameBegin = ("— ").length;  		}		myAuthorName = myParagraph.contents.slice (myAuthorNameBegin, myAuthorNameEnd);	}			if (foundFrenchByline || !foundByline) {			//  "First line" style (whatever that is for the story in question)		//  gets applied to the first line of the story, if there is no byline.		//  Also, all rules above get removed.				myObject.paragraphs[0].appliedParagraphStyle = myStoryStyle.FirstLine;		myObject.paragraphs[0].ruleAbove = false;	}			// blockquotes:
	
	nextParagraphIsBlockQuote = false;
	for (i=myObject.paragraphs.length-1; i >= 0; i--) {		myParagraph = myObject.paragraphs[i];
		if (myParagraph.characters[0].contents == ">") {
			if (i<myObject.paragraphs.length-1) {
		  	myNextParagraph = myObject.paragraphs[i+1];
		  }
		  if (i>0) {
		  	myPreviousParagraph = myObject.paragraphs[i-1];
	  	}
			// Get rid of the markdown blockquote marker
			myParagraph.characters[0].remove();
			// Add the ending blockquote marker for print production staff
			if (i == myObject.paragraphs.length-1 || !nextParagraphIsBlockquote) {
				myParagraph.insertionPoints[-1].contents = "[END BLOCKQUOTE]\r";
			}
			// Add the beginning blockquote marker for print production staff
			if (i == 0 || myObject.paragraphs[i-1].characters[0].contents != ">") {
				myParagraph.insertionPoints[0].contents = "[BEGIN BLOCKQUOTE]\r";
			}
			nextParagraphIsBlockquote = true;
		}
		else nextParagraphIsBlockquote = false;
	}
			
	// shirt-tails:		for (i=myObject.paragraphs.length-1; i >= 0; i--) {		myParagraph = myObject.paragraphs[i];		if (((myFindText(myParagraph, '{findWhat: "' + myAuthorName + '"}').length > 0) 					&& (myParagraph.appliedParagraphStyle.name.toLowerCase().search("byline") == -1))				|| (myFindText(myParagraph, '{findWhat: "Questions for Philologos can be sent to philologos@forward.com"}').length > 0)) {			myParagraph.appliedParagraphStyle = myStoryStyle.Shirttail;		}	}		// In this weeks:		if (myStoryType == "InThisWeeks") {		for (i=0; i < myObject.paragraphs.length; i++) {			myParagraph = myObject.paragraphs[i];			if (myParagraph.characters[0].contents != SpecialCharacters.bulletCharacter) {				myParagraph.insertionPoints[0].contents = " ";				myParagraph.insertionPoints[0].contents = SpecialCharacters.bulletCharacter;			}		}	}	// Hyperlinks:  Convert markdown hyperlinks to InDesign Hyperlink objects.	myObject.markdownToIndesign(false);  // false means don't override existing Indesign hyperlinks.	}										function myFindChangePass(myObject, myFindChangeFileName, myFindChangeFolderName){
	var myScriptFileName, myFindChangeFile, myScriptFile, myResult;	var myFindChangeArray, myFindPreferences, myChangePreferences, myFindLimit, myStory;	var myStartCharacter, myEndCharacter;	var myFindChangeFile = myFindFile(myFindChangeFileName, myFindChangeFolderName);	if(myFindChangeFile != null){		myFindChangeFile = File(myFindChangeFile);		var myResult = myFindChangeFile.open("r", undefined, undefined);		if(myResult == true){			//Loop through the find/change operations.			do{				myLine = myFindChangeFile.readln();				//Ignore comment lines and blank lines.				if((myLine.substring(0,4)=="text")||(myLine.substring(0,4)=="grep")||(myLine.substring(0,5)=="glyph")){					myFindChangeArray = myLine.split("\t");					//The first field in the line is the findType string.					myFindType = myFindChangeArray[0];					//The second field in the line is the FindPreferences string.					myFindPreferences = myFindChangeArray[1];					//The second field in the line is the ChangePreferences string.					myChangePreferences = myFindChangeArray[2];					//The fourth field is the range--used only by text find/change.					myFindChangeOptions = myFindChangeArray[3];					switch(myFindType){						case "text":							myFindText(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);							break;						case "grep":							myFindGrep(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);							break;						case "glyph":							myFindGlyph(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions);							break;					}				}			} while(myFindChangeFile.eof == false);			myFindChangeFile.close();		}	}	else error_exit ("There's been an error getting the Find/Change file " + myFindChangeFileName + ".  Blame the programmer.");}						function myFindText(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){	try {
		var myFoundItems;		var myString;		//Reset the find/change preferences before each search.		app.changeTextPreferences = NothingEnum.nothing;		app.findTextPreferences = NothingEnum.nothing;		myString = "app.findTextPreferences.properties = "+ myFindPreferences + ";";		if (myChangePreferences) 		    myString += "app.changeTextPreferences.properties = " + myChangePreferences + ";";		if (myFindChangeOptions) 		    myString += "app.findChangeTextOptions.properties = " + myFindChangeOptions + ";";
		app.doScript(myString, ScriptLanguage.javascript);		if (myChangePreferences)	    	myFoundItems = myObject.changeText();	    else	        myFoundItems = myObject.findText();		//Reset the find/change preferences after each search.		app.changeTextPreferences = NothingEnum.nothing;		app.findTextPreferences = NothingEnum.nothing;		return myFoundItems;
	}
	catch (e) {
		alert ("Script will exit now. Find/change failed on the following text:\r\r" + myObject.contents);
		exit();
	}}function myFindGrep(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){
	var myFoundItems;	var myString;	//Reset the find/change preferences before each search.	app.changeGrepPreferences = NothingEnum.nothing;	app.findGrepPreferences = NothingEnum.nothing;	myString = "app.findGrepPreferences.properties = "+ myFindPreferences + ";";	if (myChangePreferences) 	    myString += "app.changeGrepPreferences.properties = " + myChangePreferences + ";";	if (myFindChangeOptions) 	    myString += "app.findChangeGrepOptions.properties = " + myFindChangeOptions + ";";	app.doScript(myString, ScriptLanguage.javascript);	if (myChangePreferences)    	myFoundItems = myObject.changeGrep();    else        myFoundItems = myObject.findGrep();	//Reset the find/change preferences after each search.	app.changeGrepPreferences = NothingEnum.nothing;	app.findGrepPreferences = NothingEnum.nothing;	return myFoundItems;}function myFindGlyph(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions){	var myFoundItems;	var myString;	//Reset the find/change preferences before each search.	app.changeGlyphPreferences = NothingEnum.nothing;	app.findGlyphPreferences = NothingEnum.nothing;	myString = "app.findGlyphPreferences.properties = "+ myFindPreferences + ";";	if (myChangePreferences) 	    myString += "app.changeGlyphPreferences.properties = " + myChangePreferences + ";";	if (myFindChangeOptions) 	    myString += "app.findChangeGlyphOptions.properties = " + myFindChangeOptions + ";";	app.doScript(myString, ScriptLanguage.javascript);	if (myChangePreferences) {
    	$.writeln (myObject.contents);    	myFoundItems = myObject.changeGlyph();
	}  else {      myFoundItems = myObject.findGlyph();
  }	//Reset the find/change preferences after each search.	app.changeGlyphPreferences = NothingEnum.nothing;	app.findGlyphPreferences = NothingEnum.nothing;	return myFoundItems;}function myFindFile(myFileName, myFolderName){	var myFile;	var myScriptFileName = getActiveScript();	//Get a file reference to the script.	var myScriptFile = File(myScriptFileName);	//Get a reference to the folder containing the script.	var myFolder = File(myScriptFile.parent.fsName + "/" + myFolderName);	//Look for the file name in the folder.	if(myFolder.getFiles(myFileName).length != 0){		myFile = myFolder.getFiles(myFileName)[0];	}	else{		myFile = null;	}	return myFile;}function getActiveScript() {    try {        var myScript = app.activeScript;    } catch(e) {        // we are running from the ESTK        var myScript = File(e.fileName);    }    return myScript;}				