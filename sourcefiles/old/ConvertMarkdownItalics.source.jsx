



main();function main(){
	var myAsteriskPlaceholder = "\uA858";
	var myItalicCharacterStyle = "ITALIC normal";
		var myObject;	//Make certain that user interaction (display of dialogs, etc.) is turned on.	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;	if (app.documents.length == 0) error_exit ("No documents are open.  Please open a document and try again.");	if (app.selection.length == 0) error_exit ("Please select something and try again.");	switch(app.selection[0].constructor.name){		case "Character":		case "Word":		case "TextStyleRange":		case "Line":		case "Paragraph":		case "TextColumn":		case "Text":		case "Cell":		case "Column":		case "Row":		case "Table":		case "Story":			myObject = app.selection[0];			break;		// If they've selected a text frame, make sure they've selected only one, but if they have selected only one,		// then both a text frame and an insertion point have the same result:  myObject = parentStory.		case "TextFrame":		    if (app.selection.length > 1) error_exit ("If you're going to select a text frame, "		                                    + "please select that text frame and nothing else, and try again.");		case "InsertionPoint":		    myObject = app.selection[0].parentStory;		    break;		default:			//Something was selected, but it wasn't a text object, so search the document.			error_exit ("Please select a story, part of a story or a text frame, and start again.");	}
	if (myObject == null) error_exit ("There's been an error of indeterminate nature.  Probably best to blame the programmer.");	
	// Now for the meat of this script.

	app.changeGrepPreferences = NothingEnum.nothing;	app.findGrepPreferences = NothingEnum.nothing;
	
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;
  
  // Change ALL asterisks to placeholders. 
//	app.findTextPreferences.findWhat = "*";
//	app.changeTextPreferences.changeTo = myAsteriskPlaceholder;
//	myObject.changeText();



	// Change single asterisks back to asterisks.
	
//	var myObjectLength =  myObject.characters.length;
//	for (var i=0; i<myObjectLength; i++) {
//	  if (myObject.characters[i].contents == myAsteriskPlaceholder) {
//			if (       (i==0 || myObject.characters[i-1] != myAsteriskPlaceholder)
//			        && (i==myObjectLength-1 || myObject.characters[i+1] != myAsteriskPlaceholder) ) {
//			  myObject.characters[i].contents = "*";
//			}
//	  }
//	}
	
	// Now change asterisks (single ones only) to italic.
	var myRegexp = /(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/;
	app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);
	app.changeGrepPreferences.changeTo = "$1";
	app.changeGrepPreferences.appliedCharacterStyle = myItalicCharacterStyle;
	myObject.changeGrep();
	
	app.changeGrepPreferences = NothingEnum.nothing;	app.findGrepPreferences = NothingEnum.nothing;
	
	app.changeTextPreferences = NothingEnum.nothing;	app.findTextPreferences = NothingEnum.nothing;
  
  
  function error_exit (message) {    if (arguments.length > 0) alert (unescape(message));    exit();  } 
}