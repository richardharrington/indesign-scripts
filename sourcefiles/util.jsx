// namespacing is done in two ways here:

// 1. newly written functions are added to the FORWARD.Util namespace.

// 2. Augmentations of Indesign and Javascript builtin constructor function prototypes 
//    are also added to the FORWARD.Util namespace, and are then also added as methods
//    to the constructor functions, where their property names are given
//    the prefix FORWARD_


;


var FORWARD = FORWARD || {};

if (!FORWARD.Util) {
    
    FORWARD.Util = {};
    
    (function() {
        
        var Util = FORWARD.Util;

        Util.addMethodToPrototypes = function( method, property /* , a bunch of constructor functions */ ) {
            var i, len;
            var constructors = Array.prototype.slice.call( arguments, 2 );

            for (i = 0, len = constructors.length; i < len; i++) {
                constructors[i].prototype[property] = method;
            }
        }
        
        
        // ---------------------------------
        
        // First, all the standalone functions (ones without "this" keywords in them):

        Util.error_exit = function( message ) {
            if (arguments.length > 0) alert(unescape(message));
            exit();
        }

        
        // This forEach method will work on InDesign collections
        // as well as regular arrays. It also has a built-in mapping feature,
        // so that if you pass it a function that returns a value,
        // forEach will return an array of those values.

        Util.forEach = function( array, action ) {
            
            // If it's an InDesign DOM collection
            if (array.everyItem) {                      
                array = array.everyItem().getElements();
            }

            var result = [];
            for (var i = 0, len = array.length; i < len; i++ ) {
                result.push( action( array[i], i ));
            }
            return result;
        };


        Util.isIn = function( searchValue, array ) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === searchValue) return true;
            }
        };
            
        
        Util.isArray = function( obj ) {
            return Object.prototype.toString.call( obj ) === "[object Array]";
        };
        
        Util.selectionIs = function( /* further argument list of valid constructor names for the selection */) {
            
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
                
        Util.reverseString = function (str) {
            var newStr = '';
            var i;
            for (i=0; i<str.length; i++) {
                newStr = newStr + str[str.length-i-1];
            }
            return newStr;
        }
        
        Util.onlyWhitespace = function(obj) /* returns boolean */ {
            var i;
            var myFoundNonWhitespace;
            for (i=0; i<obj.length; i++) {
                myFoundNonWhitespace = myFindGrep(obj.characters[i], {findWhat: "[^[:space:]]"}, undefined, {wholeWord: false, caseSensitive: true});
                if (myFoundNonWhitespace.length > 0) {
                    return false;
                }
            }
            return true;
        }
        
        Util.containsAny = function(myStr, mySearchWords, caseSensitive) {
            if (arguments.length < 2) var caseSensitive = false; // defaults to case-insensitive 
            if (!caseSensitive) myStr = myStr.toLowerCase();
            var i;
            var mySearchWord;
            for (i = 0; i < mySearchWords.length; i++) {
                mySearchWord = mySearchWords[i];
                if (!caseSensitive) mySearchWord = mySearchWord.toLowerCase();
                if (myStr.search(mySearchWord) != -1) {
                    return true;
                }
            }
            return false;
        }
        
        Util.add_leading_zeroes = function(myNum, numDigits) {  
            
            var myStr = "" + myNum;
            var numZeros = numDigits - myStr.length;

            for (var i = 0; i < numZeros; i++) {
                myStr = "0" + myStr;
            }
            return myStr;
        }
        
            
        // takes either a string or an InDesign text object
        
        Util.convertToStraightQuotes = function( myObject ) {
            
            if (typeof myObject === "string" ) {
                var myStr = myObject;
                myStr = myStr.replace (/[“”]/g, '"');
                myStr = myStr.replace (/[‘’]/g, "'");
                return myStr;
                
            } else {
                myFindText (myObject, {findWhat: '“'}, {changeTo: '"'});
                myFindText (myObject, {findWhat: '”'}, {changeTo: '"'});
                myFindText (myObject, {findWhat: "‘"}, {changeTo: "'"});
                myFindText (myObject, {findWhat: "’"}, {changeTo: "'"});
                return myObject;
            }
        }
                
        
        
        Util.getActiveScript = function() {
            try {
                var myScript = app.activeScript;
            } catch (e) {
                // we are running from the ESTK
                var myScript = File(e.fileName);
            }
            return myScript;
        }
        
        
        Util.myFindFile = function(myFileName, myFolderName) {
            var myFile;
            var myScriptFileName = Util.getActiveScript();
            
            //Get a file reference to the script.
            var myScriptFile = File(myScriptFileName);
            
            //Get a reference to the folder containing the script.
            var myFolder = File(myScriptFile.parent.fsName + "/" + myFolderName);
            
            //Look for the file name in the folder.
            if (myFolder.getFiles(myFileName).length != 0) {
                myFile = myFolder.getFiles(myFileName)[0];
            } else {
                myFile = null;
            }
            return myFile;
        }

        
        // Returns an array of hyperlink objects whose source texts
        // are wholly or partially contained within the textObj argument.
        
        Util.findHyperlinks = function( textObj ) {
            
            var textObjParentStory = (textObj.constructor.name == "Story") ? textObj : textObj.parentStory;
            var doc = textObjParentStory.parent;
        
            var foundLinks = [];
            for (var linkIndex = doc.hyperlinks.length - 1; linkIndex >= 0; linkIndex--) {
                var link = doc.hyperlinks[linkIndex];
                if (link.source && link.source.sourceText) {
                    var linkText = link.source.sourceText;

                    // If linkText is in the same story as textObj, 
                    // and linkText is neither entirely before 
                    // textObj nor entirely after it, then...

                    if ((linkText.parentStory == textObjParentStory)
                                && ( ! ((linkText.index + linkText.length <= textObj.index) 
                                || (linkText.index >= textObj.index + textObj.length))) ) {
                        foundLinks.push(link);
                    }
                }
            }
            return foundLinks;
        }
        
         
        // ---------------------------------
        
        // Now, all the methods intended to be added to the builtin and InDesign prototypes
        // (this means that they have "this" keywords in them):
        
        
        
        Util.removeDeep = function() {
            var src = this.source;
            var dest = this.destination;
            var destHidden = dest.hidden;

            this.remove();
            src.remove();
            if (!destHidden) 
                dest.remove();
        };

        Util.addMethodToPrototypes( Util.removeDeep, "FORWARD_removeDeep", Hyperlink );
        
        Util.multiChangeGrep = function (findChangeArray) {
            var findChangePair;
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
            app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};
            for (var i=0; i<findChangeArray.length; i++) {
                findChangePair = findChangeArray[i];
                app.findGrepPreferences.findWhat = findChangePair.find;
                app.changeGrepPreferences.changeTo = findChangePair.change;
                this.changeGrep();
                app.changeGrepPreferences = NothingEnum.nothing;
                app.findGrepPreferences = NothingEnum.nothing;
            }
        }           
        
        Util.addMethodToPrototypes( Util.multiChangeGrep, "FORWARD_multiChangeGrep",
            Character, 
            Word, 
            TextStyleRange, 
            Line, 
            Paragraph, 
            TextColumn,
            Text, 
            Cell, 
            Column, 
            Row, 
            Table, 
            Story, 
            TextFrame, 
            XMLElement, 
            Document, 
            Application );
        
        // multiReplace() is intended to take 
        // an array of find/change pairs, the first
        // element of each of which will be converted
        // first into a RegExp, if it comes in as a string.
        
        Util.multiReplace = function (findChangeArray) {
            var myFind, myChange;
            var findChangePair;
            var str = this;
            for (var i=0; i<findChangeArray.length; i++) {
                findChangePair = findChangeArray[i];
                myFind = findChangePair.find;
                myChange = findChangePair.change;
                if (myFind.constructor.name == "String") {
                    myBefore = RegExp (myFind);
                } 
                str = str.replace (myFind, myChange)
            }
            return str;
        };
        
        Util.addMethodToPrototypes( Util.multiReplace, "FORWARD_multiReplace", String );

        // The function markdownToIndesign() is given an object containing a block
        // of text, and it finds all the hyperlinks inside the text
        // that are in markdown format and converts them to 
        // InDesign Hyperlink format (i.e., it removes each URL from
        // the text itself and puts it into an InDesign Hyperlink).
        
        Util.markdownToIndesign = function( /*bool*/ killRedundantIndesignHyperlinks, killAllIndesignHyperlinks ) {

            // Set defaults for parameters
                
            if (arguments.length < 2) 
                var killAllIndesignHyperlinks = false;
            if (arguments.length < 1) 
                var killRedundantIndesignHyperlinks = true;
                  
                // Check for the existence of the "ITALIC normal" character style,
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
                    $.writeln (this); // debugging
                    myDoc = this.parentStory.parent;
                    
                }
                if (myDoc.characterStyles.item (myItalicCharacterStyleName) == null) {
                    myDoc.characterStyles.add ({name: myItalicCharacterStyleName, appliedFont: "ITC Slimbach", fontStyle: "Book Italic" });
                }
                
                // Now for the main part of this markdownToIndesign function.
                
                var escapedChars = {
                
                // The reason pairs is an array rather than an object
                // with named properties like "backslash", etc., is that 
                // the order of elements is very important.  The first
                // one has to be processed first.
                
                // The placeholders are chosen arbitrarily from a character
                // set that we will never use. From the Unicode pages:
                
                //   "The Phags-pa script was designed to reflect the sounds of Mongolian, 
                //    and was used for writing Mongolian, Chinese and other languages 
                //    during the Yuan dynasty (1271–1368) of Mongolia. It is still used 
                //    occasionally as a decorative script for writing Tibetan."
                
                // The letters below spell "Free Tibet" in Tibetan.
                
                pairs : [
                    {baseChar: "\\", placeholder: "\uA84E"},
                    {baseChar: "]", placeholder: "\uA861"},
                    {baseChar: ")", placeholder: "\uA84A"},
                    {baseChar: "*", placeholder: "\uA858"} 
                  
                    // others in this arbitray series, if needed in the future:
                    // \uA843, \uA850, \uA84B
                  
                ],
                getHidingPairs: function () {
                    var arr = [];
                    for (var i=0; i < this.pairs.length; i++) {
                        arr[i] = {find: "\\\\\\" + this.pairs[i].baseChar, change: this.pairs[i].placeholder};
                    }
                  
                    // Support for other markdown codes
                    // will be added as needed, but in the
                    // meantime, delete all single backslashes:
                  
                    arr[i] = {find: "\\\\", change: ""};
                    return arr;
                },
                getRestoringPairs: function () {
                    var arr = [];
                    for (var i=0; i < this.pairs.length; i++) {
                        arr[i] = {find: this.pairs[i].placeholder, change: this.pairs[i].baseChar};
                    }
                    return arr;
                }
            }    
            
            var myRegexp;
            var myHyperlink;
            var myLinkText;
            switch (this.constructor.name) {
                case "Document":
                myDoc = this;
                break;
                
                case "Story":
                myDoc = this.parent;
                break;
                
                default:
                myDoc = this.parentStory.parent;
            }
              
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
            app.findChangeGrepOptions.properties = {includeFootnotes:true, includeMasterPages:true, includeHiddenLayers:true, wholeWord:false};
               
            // Hide escaped characters before we parse the markdown code
              
            this.FORWARD_multiChangeGrep (escapedChars.getHidingPairs());
              
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
              
            // Convert markdown hyperlinks to InDesign hyperlinks.
              
            myRegexp = /\[[^]]+]\([^)]+\)/;
            app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);
            var myLinkTexts = this.findGrep(); 
            for (var i=0; i < myLinkTexts.length; i++) {
                myLinkText = myLinkTexts[i];
                var myRedundantHyperlinks;
                    
                // Get rid of any Indesign hyperlinks inside markdown hyperlinks,
                // if that boolean parameter is true.
                    
                if (killRedundantIndesignHyperlinks) {
                        
                    // myRedundantHyperlinks should come out null if we have already removed ALL hyperlinks.
                        
                    myRedundantHyperlinks = checkHyperlinks (myLinkText, myDoc);
                    if (myRedundantHyperlinks) {
                        for (var r=myRedundantHyperlinks.length-1; r>=0; r--) {
                            myRedundantHyperlinks[r].source.remove();
                        }
                    }
                }
                
              
              
                // This "try" statement will fail and be ignored
                // if the text in question is already part of a hyperlink.
                // Which of course shouldn't happen because we would just
                // have removed the source in the loop above, but just in case. 
            
                // Create InDesign hyperlink from markdown code.
                
                myHyperlink = null;
                try  {
                    var myHyperlinkSourceText = myDoc.hyperlinkTextSources.add (myLinkText); 
                    var myHyperlinkDestURL = myDoc.hyperlinkURLDestinations.add();
                    myHyperlink = myDoc.hyperlinks.add(myHyperlinkSourceText, myHyperlinkDestURL); 
                    myHyperlink.properties = DEFAULT_HYPERLINK_PROPERTIES;
                    myHyperlink.destination.destinationURL = myLinkText.contents.match (/\(([^)]+)\)/) [1];
                  
                    // Restore escaped characters in URL
                  
                    myHyperlink.destination.destinationURL = 
                    myHyperlink.destination.destinationURL.FORWARD_multiReplace (escapedChars.getRestoringPairs());
                }
                catch (e) {}  // ignore errors
                
                // Remove URL and brackets from the text itself.
                
                myRegexp = /\[([^]]+)].*/;
                app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);
                app.changeGrepPreferences.changeTo = "$1";
                myLinkText.changeGrep();
            }
              
            // Now do other markdown processing.  Bold and italic, blockquote and poetry, 
            // maybe headings.  TO BE DONE.
              
            // Here is a quick and dirty thing to parse italics only:
              
            // Now change asterisks (single ones only) to italic.
              
            myRegexp = /(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/;
            app.findGrepPreferences.findWhat = myRegexp.toString().slice(1,-1);
            app.changeGrepPreferences.changeTo = "$1";
            app.changeGrepPreferences.appliedCharacterStyle = myItalicCharacterStyleName;
            this.changeGrep();
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
              
            // Markdown code parsed.  Restore escaped characters.
              
            this.FORWARD_multiChangeGrep (escapedChars.getRestoringPairs());
              
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
        };
        
        Util.addMethodToPrototypes( Util.markdownToIndesign, "FORWARD_multiReplace", 
            Character,
            Word,
            TextStyleRange,
            Line,
            Paragraph,
            TextColumn,
            Text,
            Cell,
            Column,
            Row,
            Table,
            Story,
            TextFrame,
            XMLElement,
            Document );
    
    })();
}
