;


// How do we want our hyperlinks to look?

var DEFAULT_HYPERLINK_PROPERTIES = {
	borderColor: [183, 27, 23],  // Burgundy, roughly.
	borderStyle: HyperlinkAppearanceStyle.DASHED,
  width: HyperlinkAppearanceWidth.THIN,
  visible: true,
};

function error_exit(message) {    if (arguments.length > 0) alert(unescape(message));    exit();}


var isArray = function( obj ) {
    return Object.prototype.toString.call( obj ) === "[object Array]";
};


function selectionIs( /* further argument list of valid constructor names for the selection */) {
	
	  var sel = app.selection[0];
	  
	  if (!sel || !sel.isValid) {
	  	  return;
	  }
	
	  var i, 
	      len = arguments.length;
	  
	  for ( i = 0; i < len; i++) {
	  	  if (arguments[i] === sel.constructor.name) {
	  	  	  return true;
	  	  }
	  }
	  return false;
}
	  	


Character.prototype.multiChangeGrep = Word.prototype.multiChangeGrep = TextStyleRange.prototype.multiChangeGrep = Line.prototype.multiChangeGrep = Paragraph.prototype.multiChangeGrep = TextColumn.prototype.multiChangeGrep = Text.prototype.multiChangeGrep = Cell.prototype.multiChangeGrep = Column.prototype.multiChangeGrep = Row.prototype.multiChangeGrep = Table.prototype.multiChangeGrep = Story.prototype.multiChangeGrep = TextFrame.prototype.multiChangeGrep = XMLElement.prototype.multiChangeGrep = Document.prototype.multiChangeGrep = Application.prototype.multiChangeGrep = function (findChangeArray) {  var findChangePair;  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    app.findGrepPreferences.findWhat = findChangePair.find;    app.changeGrepPreferences.changeTo = findChangePair.change;    this.changeGrep();  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  }}			// multiReplace() is intended to take // an array of find/change pairs, the first// element of each of which will be converted// first into a RegExp, if it comes in as a string.String.prototype.multiReplace = function (findChangeArray) {  var myFind, myChange;  var findChangePair;  var str = this;  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    myFind = findChangePair.find;    myChange = findChangePair.change;    if (myFind.constructor.name == "String") {      myBefore = RegExp (myFind);    }     str = str.replace (myFind, myChange)  }  return str;};
function reverseString (str) {	var newStr = '';	var i;	for (i=0; i<str.length; i++) {		newStr = newStr + str[str.length-i-1];	}	return newStr;}
function onlyWhitespace (obj) /* returns boolean */ {	var i;	var myFoundNonWhitespace;	for (i=0; i<obj.length; i++) {		myFoundNonWhitespace = myFindGrep(obj.characters[i], {findWhat: "[^[:space:]]"}, undefined, {wholeWord: false, caseSensitive: true});		if (myFoundNonWhitespace.length > 0) {			return false;		}	}	return true;}
function containsAny(myStr, mySearchWords, caseSensitive) {    if (arguments.length < 2) var caseSensitive = false; // defaults to case-insensitive     if (!caseSensitive) myStr = myStr.toLowerCase();    var i;    var mySearchWord;    for (i = 0; i < mySearchWords.length; i++) {        mySearchWord = mySearchWords[i];        if (!caseSensitive) mySearchWord = mySearchWord.toLowerCase();        if (myStr.search(mySearchWord) != -1) {            return true;        }    }    return false;}
function add_leading_zeroes (myNum, numDigits) {  
	  var myStr = "" + myNum;
  var numZeros = numDigits - myStr.length;
  
  for (var i = 0; i < numZeros; i++) {
  	myStr = "0" + myStr;
  }
  return myStr;
}
  	


// This will take a string.
function convertStringToStraightQuotes (myStr) {
  myStr = myStr.replace (/[“”]/g, '"');
  myStr = myStr.replace (/[‘’]/g, "'");
  return myStr;
}
  
// This will take an InDesign text object.
function convertTextObjectToStraightQuotes (myObject) {
  myFindText (myObject, {findWhat: '“'}, {changeTo: '"'}, undefined);
  myFindText (myObject, {findWhat: '”'}, {changeTo: '"'}, undefined);
  myFindText (myObject, {findWhat: "‘"}, {changeTo: "'"}, undefined);
  myFindText (myObject, {findWhat: "’"}, {changeTo: "'"}, undefined);
}


function myFindFile(myFileName, myFolderName) {    var myFile;    var myScriptFileName = getActiveScript();    //Get a file reference to the script.    var myScriptFile = File(myScriptFileName);    //Get a reference to the folder containing the script.    var myFolder = File(myScriptFile.parent.fsName + "/" + myFolderName);    //Look for the file name in the folder.    if (myFolder.getFiles(myFileName).length != 0) {        myFile = myFolder.getFiles(myFileName)[0];    } else {        myFile = null;    }    return myFile;}function getActiveScript() {    try {        var myScript = app.activeScript;    } catch (e) {        // we are running from the ESTK        var myScript = File(e.fileName);    }    return myScript;}


// Returns an array of hyperlink objects whose source texts
// are wholly or partially contained within the textObj argument.
function findHyperlinks (textObj) {
	
	var textObjParentStory = (textObj.constructor.name == "Story") ? textObj : textObj.parentStory;
	
	var doc = textObjParentStory.parent;

  var foundLinks = [];  for (var linkIndex=doc.hyperlinks.length-1; linkIndex >= 0; linkIndex--) {    var link = doc.hyperlinks[linkIndex];    var linkText = link.source.sourceText;
        // If linkText is in the same story as textObj,     // and linkText is neither entirely before     // textObj nor entirely after it, then...
        if ((linkText.parentStory == textObjParentStory)             && ( ! ((linkText.index + linkText.length <= textObj.index)              || (linkText.index >= textObj.index + textObj.length))) ) {      foundLinks.push(link);    }  }  return foundLinks;}

 // The function markdownToIndesign() is given an object containing a block// of text, and it finds all the hyperlinks inside the text// that are in markdown format and converts them to // InDesign Hyperlink format (i.e., it removes each URL from// the text itself and puts it into an InDesign Hyperlink).


Character.prototype.markdownToIndesign = Word.prototype.markdownToIndesign = TextStyleRange.prototype.markdownToIndesign = Line.prototype.markdownToIndesign = Paragraph.prototype.markdownToIndesign = TextColumn.prototype.markdownToIndesign = Text.prototype.markdownToIndesign = Cell.prototype.markdownToIndesign = Column.prototype.markdownToIndesign = Row.prototype.markdownToIndesign = Table.prototype.markdownToIndesign = Story.prototype.markdownToIndesign = TextFrame.prototype.markdownToIndesign = XMLElement.prototype.markdownToIndesign = Document.prototype.markdownToIndesign = function ( /*bool*/ killRedundantIndesignHyperlinks, killAllIndesignHyperlinks ) {
	// Set defaults for parameters
	if (arguments.length < 2) 
		var killAllIndesignHyperlinks = false;
	if (arguments.length < 1) 
	  var killRedundantIndesignHyperlinks = true;	// Check for the existence of the "ITALIC normal" character style,
	// to support our quick and dirty fix to process
	// Markdown italics in the case of Word files. 
	var myItalicCharacterStyleName = "ITALIC normal";
	var myDoc;
	switch (this.constructor.name) {
		case "Document" :
		  myDoc = this;
		  break;
		case "Story" :
		  myDoc = this.parent;
		  break;
		default:
		  $.writeln (this);
		  alert ("why are we even here?");
		  myDoc = this.parentStory.parent;
	}
	if (myDoc.characterStyles.item (myItalicCharacterStyleName) == null) {
		myDoc.characterStyles.add ({name: myItalicCharacterStyleName, appliedFont: "ITC Slimbach", fontStyle: "Book Italic" });
	}
	
	// Now for the main part of this markdownToIndesign function.
  var escapedChars = {    // The reason pairs is an array rather than an object    // with named properties like "backslash", etc., is that     // the order of elements is very important.  The first    // one has to be processed first.    pairs : [      {baseChar: "\\", placeholder: "\uA84E"},      {baseChar: "]", placeholder: "\uA861"},      {baseChar: ")", placeholder: "\uA84A"},      {baseChar: "*", placeholder: "\uA858"}       // others in the series:      // \uA843, \uA850, \uA84B    ],    getHidingPairs: function () {      var arr = [];      for (var i=0; i < this.pairs.length; i++) {        arr[i] = {find: "\\\\\\" + this.pairs[i].baseChar, change: this.pairs[i].placeholder};      }      // Support for other markdown codes      // will be added as needed, but in the      // meantime, delete all single backslashes:      arr[i] = {find: "\\\\", change: ""};      return arr;    },    getRestoringPairs: function () {      var arr = [];      for (var i=0; i < this.pairs.length; i++) {        arr[i] = {find: this.pairs[i].placeholder, change: this.pairs[i].baseChar};      }      return arr;    }  }      var myRegexp;  var myHyperlink;  var myLinkText;
  switch (this.constructor.name) {	case "Document":	  myDoc = this;	  break;	case "Story":	  myDoc = this.parent;	  break;	default:	  myDoc = this.parentStory.parent;  }    app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};     // Hide escaped characters before we parse the markdown code  this.multiChangeGrep (escapedChars.getHidingPairs());  
  // Go through the hyperlinks in the passed object and either kill them or set them
  // to our style, depending on the killAllHyperlinks parameter.
  var myCheckedHyperlinks = checkHyperlinks (this, myDoc);
  if (myCheckedHyperlinks) {
    for (var h=myCheckedHyperlinks.length-1; h>=0; h--) {
    	if (killAllIndesignHyperlinks) {
    		myDoc.hyperlinks[h].source.remove();
    	}
    	else {
	    	myCheckedHyperlinks[h].properties = DEFAULT_HYPERLINK_PROPERTIES;
    	}
    }
  }
  	
  
  
  
  // Convert markdown hyperlinks to InDesign hyperlinks.  myRegexp = /\[[^]]+]\([^)]+\)/;  app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);  var myLinkTexts = this.findGrep();   for (var i=0; i < myLinkTexts.length; i++) {		myLinkText = myLinkTexts[i];		var myRedundantHyperlinks;		// Get rid of any Indesign hyperlinks inside markdown hyperlinks,		// if that boolean parameter is true.		if (killRedundantIndesignHyperlinks) {
			// myRedundantHyperlinks should come out null if we have already removed ALL hyperlinks.			myRedundantHyperlinks = checkHyperlinks (myLinkText, myDoc);			if (myRedundantHyperlinks) {				for (var r=myRedundantHyperlinks.length-1; r>=0; r--) {					myRedundantHyperlinks[r].source.remove();				}			}		}	  
      // This "try" statement will fail and be ignored    // if the text in question is already part of a hyperlink.    // Which of course shouldn't happen because we would just		// have removed the source in the loop above, but just in case.	    // Create InDesign hyperlink from markdown code.    myHyperlink = null;    try  {		  var myHyperlinkSourceText = myDoc.hyperlinkTextSources.add (myLinkText);       var myHyperlinkDestURL = myDoc.hyperlinkURLDestinations.add();      myHyperlink = myDoc.hyperlinks.add(myHyperlinkSourceText, myHyperlinkDestURL); 
      myHyperlink.properties = DEFAULT_HYPERLINK_PROPERTIES;
      myHyperlink.destination.destinationURL = myLinkText.contents.match (/\(([^)]+)\)/) [1];      // Restore escaped characters in URL      myHyperlink.destination.destinationURL = myHyperlink.destination.destinationURL.multiReplace (escapedChars.getRestoringPairs());    }    catch (e) {}  // ignore errors        // Remove URL and brackets from the text itself.    myRegexp = /\[([^]]+)].*/;    app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);    app.changeGrepPreferences.changeTo = "$1";    myLinkText.changeGrep();  }    // Now do other markdown processing.  Bold and italic, blockquote and poetry,   // maybe headings.  TO BE DONE.
  
  // Here is a quick and dirty thing to parse italics only:
  
  // Now change asterisks (single ones only) to italic.
	myRegexp = /(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/;
	app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);
	app.changeGrepPreferences.changeTo = "$1";
	app.changeGrepPreferences.appliedCharacterStyle = myItalicCharacterStyleName;
	this.changeGrep();
  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;
  
      // Markdown code parsed.  Restore escaped characters.  this.multiChangeGrep (escapedChars.getRestoringPairs());    app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;};