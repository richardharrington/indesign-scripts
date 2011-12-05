Character.prototype.multiChangeGrep = Word.prototype.multiChangeGrep = TextStyleRange.prototype.multiChangeGrep = Line.prototype.multiChangeGrep = Paragraph.prototype.multiChangeGrep = TextColumn.prototype.multiChangeGrep = Text.prototype.multiChangeGrep = Cell.prototype.multiChangeGrep = Column.prototype.multiChangeGrep = Row.prototype.multiChangeGrep = Table.prototype.multiChangeGrep = Story.prototype.multiChangeGrep = TextFrame.prototype.multiChangeGrep = XMLElement.prototype.multiChangeGrep = Document.prototype.multiChangeGrep = Application.prototype.multiChangeGrep = function (findChangeArray) {  var findChangePair;  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    app.findGrepPreferences.findWhat = findChangePair.find;    app.changeGrepPreferences.changeTo = findChangePair.change;    this.changeGrep();  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  }}			// multiReplace() is intended to take // an array of find/change pairs, the first// element of each of which will be converted// first into a RegExp, if it comes in as a string.String.prototype.multiReplace = function (findChangeArray) {  var myFind, myChange;  var findChangePair;  var str = this;  for (var i=0; i<findChangeArray.length; i++) {    findChangePair = findChangeArray[i];    myFind = findChangePair.find;    myChange = findChangePair.change;    if (myFind.constructor.name == "String") {      myBefore = RegExp (myFind);    }     str = str.replace (myFind, myChange)  }  return str;}// The function markdownToIndesign() is given an object containing a block// of text, and it finds all the hyperlinks inside the text// that are in markdown format and converts them to // InDesign Hyperlink format (i.e., it removes each URL from// the text itself and puts it into an InDesign Hyperlink).Character.prototype.markdownToIndesign = Word.prototype.markdownToIndesign = TextStyleRange.prototype.markdownToIndesign = Line.prototype.markdownToIndesign = Paragraph.prototype.markdownToIndesign = TextColumn.prototype.markdownToIndesign = Text.prototype.markdownToIndesign = Cell.prototype.markdownToIndesign = Column.prototype.markdownToIndesign = Row.prototype.markdownToIndesign = Table.prototype.markdownToIndesign = Story.prototype.markdownToIndesign = TextFrame.prototype.markdownToIndesign = XMLElement.prototype.markdownToIndesign = Document.prototype.markdownToIndesign = function (/*bool*/ overrideExistingIndesignHyperlinks ) {  var poetryStyleName = "ARTS poetry multi-para (middle)";
  var blockquoteStyleName = "ARTS blockquote multi-para (middle)";
  
    
    
      var escapedChars = {    // The reason pairs is an array rather than an object    // with named properties like "backslash", etc., is that     // the order of elements is very important.  The first    // one has to be processed first.    pairs : [      {baseChar: "\\", placeholder: "\uA84E"},      {baseChar: "]", placeholder: "\uA861"},      {baseChar: ")", placeholder: "\uA84A"},      {baseChar: "*", placeholder: "\uA858"}       // others in the series:      // \uA843, \uA850, \uA84B    ],    getHidingPairs: function () {      var arr = [];      for (var i=0; i < this.pairs.length; i++) {        arr[i] = {find: "\\\\\\" + this.pairs[i].baseChar, change: this.pairs[i].placeholder};      }      // Support for other markdown codes      // will be added as needed, but in the      // meantime, delete all single backslashes:      arr[i] = {find: "\\\\", change: ""};      return arr;    },    getRestoringPairs: function () {      var arr = [];      for (var i=0; i < this.pairs.length; i++) {        arr[i] = {find: this.pairs[i].placeholder, change: this.pairs[i].baseChar};      }      return arr;    }  }      function checkHyperlinks (textObj, doc) {    var foundLinks = new Array();    for (var linkIndex=doc.hyperlinks.length-1; linkIndex >= 0; linkIndex--) {      var link = doc.hyperlinks[linkIndex];      var linkText = link.source.sourceText;      // If linkText is in the same story as textObj,       // and linkText is neither entirely before       // textObj nor entirely after it, then...      if ((linkText.parentStory == textObj.parentStory)               && ( ! ((linkText.index + linkText.length <= textObj.index)                || (linkText.index >= textObj.index + textObj.length))) ) {        foundLinks.push(link);      }    }    return foundLinks;  }   switch (this.constructor.name) {	case "Document":	  myDoc = this;	  break;	case "Story":	  myDoc = this.parent;	  break;	default:	  myDoc = this.parentStory.parent;  }    var myRegexp;  var myHyperlink;  var myLinkText;
  
  app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;  app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};     // Hide escaped characters before we parse the markdown code  this.multiChangeGrep (escapedChars.getHidingPairs());    // 1. Convert markdown hyperlinks to InDesign hyperlinks.  myRegexp = /\[[^]]+]\([^)]+\)/;  app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);  var myLinkTexts = this.findGrep();   for (var i=0; i < myLinkTexts.length; i++) {		myLinkText = myLinkTexts[i];		var myRedundantHyperlinks;		// Get rid of any Indesign hyperlinks inside markdown hyperlinks,		// if that boolean parameter is true.		if (overrideExistingIndesignHyperlinks) {			myRedundantHyperlinks = checkHyperlinks (myLinkText, myDoc);				if (myRedundantHyperlinks) {				for (var r=myRedundantHyperlinks.length-1; r>=0; r--) {					myRedundantHyperlinks[r].source.remove();				}			}		}					  myHyperlink = null;	  // This "try" statement will fail and be ignored	  // if the text in question is already part of a hyperlink.	  // Which of course shouldn't happen because we would just		// have removed the source in the loop above, but just in case.			  // Create InDesign hyperlink from markdown code.	  try  {		  var myHyperlinkSourceText = myDoc.hyperlinkTextSources.add (myLinkText); 	    var myHyperlinkDestURL = myDoc.hyperlinkURLDestinations.add();	    myHyperlink = myDoc.hyperlinks.add(myHyperlinkSourceText, myHyperlinkDestURL); 	    myHyperlink.destination.destinationURL = myLinkText.contents.match (/\(([^)]+)\)/) [1];	    // Restore escaped characters in URL	    myHyperlink.destination.destinationURL = myHyperlink.destination.destinationURL.multiReplace (escapedChars.getRestoringPairs());	  }	  catch (e) {}  // ignore errors	    	  // Remove URL and brackets from the text itself.	  myRegexp = /\[([^]]+)].*/;	  app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);	  app.changeGrepPreferences.changeTo = "$1";	  myLinkText.changeGrep();  }    // 2. Process poetry and blockquotes
  
  // First convert all markdown soft returns (at least two spaces followed by a paragraph return)
  // to proper soft returns.
  app.changeTextPreferences = NothingEnum.nothing;  app.findTextPreferences = NothingEnum.nothing;  app.findChangeTextOptions.properties = {wholeWord:false};  app.findTextPreferences.findWhat = "  \r";
  app.changeTextPreferences.changeTo = "\n";
  this.changeText();
  // also get rid of extra markdown carats.
  app.findTextPreferences.findWhat = "\n>";
  app.changeTextPreferences.changeTo = "\n";
  this.changeText();
  app.changeTextPreferences = NothingEnum.nothing;  app.findTextPreferences = NothingEnum.nothing;
  
  // Now style blockquotes and poetry (poetry will be identifed by the presence of
  // soft returns, which shouldn't exist anywhere else).
  var lastBlockquoteParagraph = "none";
  for (var p=0; p<this.paragraphs.length; p++) {
  	var myParagraph = this.paragraphs[p];
  	// if it's a markdown block quote of some kind
  	if (myParagraph.characters[0].contents == ">") {
  		// Get rid of the carat.
  		myParagraph.characters[0].contents = "";
  		if (lastBlockquoteParagraph == "none") {
	  		myParagraph.insertionPoints[0].contents = "[BLOCKQUOTE OPEN]";
  		}
  		lastBlockquoteParagraph = myParagraph;
  	}
  	// else if it's not an empty line and we're ending a blockquote section
  	else if (myParagraph.characters.length>0 && lastBlockquoteParagraph != "none") {
  		lastBlockquoteParagraph.insertionPoints[-2].contents = "[BLOCKQUOTE CLOSE]";
  		lastBlockquoteParagraph = "none";
  	}
  }
  // Boundary condition at end
  if (lastBlockquoteParagraph != "none") {
  	lastBlockquoteParagraph.insertionPoints[-2].contents = "[BLOCKQUOTE CLOSE]";
  }
  
  // 3. Process bold and italic.
  for (var p=0; p<this.paragraphs.length; p++) {
  	
  
  
  // Now do other markdown processing.  Bold and italic,   // maybe headings.  TO BE DONE.    // Markdown code parsed.  Restore escaped characters.  this.multiChangeGrep (escapedChars.getRestoringPairs());    app.changeGrepPreferences = NothingEnum.nothing;  app.findGrepPreferences = NothingEnum.nothing;}