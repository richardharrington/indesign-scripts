// namespacing is done in two ways here:

// 1. newly written functions are added to the FORWARD.Util namespace.

// 2. Augmentations of Indesign and Javascript builtin constructor function prototypes 
//    are also added to the FORWARD.Util namespace, and are then also added as methods
//    to the constructor functions.


;


var FORWARD = FORWARD || {};

if (!FORWARD.Util) {
    
    FORWARD.Util = {};
    
    (function() {
        
        var util = FORWARD.Util;

        util.addMethodToPrototypes = function( method, property /* , a bunch of constructor functions */ ) {
            var i, len;
            var constructors = Array.prototype.slice.call( arguments, 2 );

            for (i = 0, len = constructors.length; i < len; i++) {
                constructors[i].prototype[property] = method;
            }
        }
        
        
        // ---------------------------------
        
        // First, all the standalone functions (ones without "this" keywords in them):

        util.errorExit = function( message ) {
            if (arguments.length > 0) alert(unescape(message));
            exit();
        };
        
        util.error_exit = util.errorExit; // Delete this when we swap out the old underscore usage.

        
        // This forEach method will work on InDesign collections
        // as well as regular arrays. It also has a built-in mapping feature,
        // so that if you pass it a function that returns a value,
        // forEach will return an array of those values.

        util.forEach = function( array, action ) {
            
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


        util.isIn = function( searchValue, array, caseSensitive ) {
            caseSensitive = (typeof caseSensitive !== 'undefined') ? caseSensitive : true;
            var item;
    
            if (!caseSensitive && typeof searchValue === 'string') {
                searchValue = searchValue.toLowerCase();
            }
            for (var i = 0, len = array.length; i < len; i++) {
                item = array[i];
                if (!caseSensitive && typeof item === 'string') {
                    item = item.toLowerCase();
                }
                if (item === searchValue) return true;
            }
        };
            
        
        util.isArray = function( obj ) {
            return Object.prototype.toString.call( obj ) === "[object Array]";
        };
        
        util.selectionIs = function( /* further argument list of valid constructor names for the selection */) {
            
              var sel = app.selection[0];
              
              if (!sel || !sel.isValid) {
                  return false;
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
                
        util.reverseString = function (str) {
            var newStr = '';
            var i;
            for (i=0; i<str.length; i++) {
                newStr = newStr + str[str.length-i-1];
            }
            return newStr;
        }
        
        util.onlyWhitespace = function(obj) /* returns boolean */ {
            var i;
            var myFoundNonWhitespace;
            for (i=0; i<obj.length; i++) {
                myFoundNonWhitespace = util.myFindGrep(obj.characters[i], {findWhat: "[^[:space:]]"}, undefined, {wholeWord: false, caseSensitive: true});
                if (myFoundNonWhitespace.length > 0) {
                    return false;
                }
            }
            return true;
        }
        
        util.containsAny = function(myStr, mySearchWords, caseSensitive) {
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
        
        util.addLeadingZeroes = function(myNum, numDigits) {  
            
            var myStr = "" + myNum;
            var numZeros = numDigits - myStr.length;

            for (var i = 0; i < numZeros; i++) {
                myStr = "0" + myStr;
            }
            return myStr;
        };
        util.add_leading_zeros = util.addLeadingZeroes; // Delete this after we replace all the old references.
        
            
        util.myFindText = function(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions) {
            //Reset the find/change preferences before each search.
            app.changeTextPreferences = NothingEnum.nothing;
            app.findTextPreferences = NothingEnum.nothing;
            app.findTextPreferences.properties = myFindPreferences;
            if (myChangePreferences) app.changeTextPreferences.properties = myChangePreferences;
            if (myFindChangeOptions) app.findChangeTextOptions.properties = myFindChangeOptions;
            var myFoundItems;
            if (myChangePreferences) {
                myFoundItems = myObject.changeText();
            } else {
                myFoundItems = myObject.findText();
            }
            //Reset the find/change preferences after each search.
            app.changeTextPreferences = NothingEnum.nothing;
            app.findTextPreferences = NothingEnum.nothing;
            return myFoundItems;
        };

        util.myFindGrep = function(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions) {
            //Reset the find/change grep preferences before each search.
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences.properties = myFindPreferences;
            if (myChangePreferences) app.changeGrepPreferences.properties = myChangePreferences;
            if (myFindChangeOptions) app.findChangeGrepOptions.properties = myFindChangeOptions;
            var myFoundItems;
            if (myChangePreferences) {
                myFoundItems = myObject.changeGrep();
            } else {
                myFoundItems = myObject.findGrep();
            }
            //Reset the find/change grep preferences after each search.
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
            return myFoundItems;
        };

        util.myFindGlyph = function(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions) {
            //Reset the find/change glyph preferences before each search.
            app.changeGlyphPreferences = NothingEnum.nothing;
            app.findGlyphPreferences = NothingEnum.nothing;
            app.findGlyphPreferences.properties;
            if (myChangePreferences) app.changeGlyphPreferences.properties;
            if (myFindChangeOptions) app.findChangeGlyphOptions.properties;
            if (myChangePreferences) {
                myFoundItems = myObject.changeGlyph();
            } else {
                myFoundItems = myObject.findGlyph();
            }
            //Reset the find/change glyph preferences after each search.
            app.changeGlyphPreferences = NothingEnum.nothing;
            app.findGlyphPreferences = NothingEnum.nothing;
            return myFoundItems;
        };
        
         
        util.getActiveScript = function() {
            try {
                var myScript = app.activeScript;
            } catch (e) {
                // we are running from the ESTK
                var myScript = File(e.fileName);
            }
            return myScript;
        }
        
        
        util.myFindFile = function(myFileName, myFolderName) {
            var myFile;
            var myScriptFileName = util.getActiveScript();
            
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
        
        util.findHyperlinks = function( textObj ) {
            
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
        
        
        // This will take a string.
        util.convertStringToStraightQuotes = function(myStr) {
            return myStr.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        };

        // This will take an InDesign text object.
        util.convertTextObjectToStraightQuotes = function(myObject) {
            util.myFindGrep(myObject, {findWhat: '[“”]'}, {changeTo: '"'}, undefined);
            util.myFindGrep(myObject, {findWhat: "[‘’]"}, {changeTo: "'"}, undefined);
        };
        
        
        // ---------------------------------
        
        // Now, all the methods intended to be added to the builtin and InDesign prototypes
        // (this means that they have "this" keywords in them):
        
        // changeDestinationSharing changes the status of a hyperlink's destination
        // property from shared to not shared, or vice versa.
        
        util.changeDestinationSharing = function( shared ) {

            var newDestHidden = !shared;  
            var doc = this.parent;

            var dest = this.destination;
            if (!dest) {
                throw new Error("This hyperlink is missing its destination.");
            }

            var destURL = dest.destinationURL;
            var destName = dest.name;
            var destHidden = dest.hidden;

            // If the shared status of the existing destination does not
            // match what we want, remove the old one and replace it with a new one.

            if (destHidden !== newDestHidden) {
                dest.remove();
                dest = doc.hyperlinkURLDestinations.add( 
                        destURL, {name: destName || Math.random().toString(), hidden: newDestHidden} );
                this.destination = dest;
            }
        };
        util.addMethodToPrototypes( util.changeDestinationSharing, "changeDestinationSharing", Hyperlink );

        // change alters a hyperlink's properties, including its destination sharing.
        
        util.change = function( props, sharedDest ) {
            if (arguments.length > 1) {
                this.changeDestinationSharing( sharedDest );
            }
            this.properties = props;  
        };
        util.addMethodToPrototypes( util.change, "change", Hyperlink );
        
        
        util.openWithoutWarnings = function (myFile, myShowingWindow) {
            if (arguments.length < 2) {
                var myShowingWindow = true; // default
            }
            // Avoid random dialog alerts (missing fonts, picture links, etc.) when opening the file(s).
            this.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;

            // This line may return an array or a single file
            var doc = this.open(myFile, myShowingWindow);  // defaults to opening a window with the document.

            // Restore user interaction
            app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
            return doc;
        };
        util.addMethodToPrototypes( util.openWithoutWarnings, "openWithoutWarnings", Application );


        util.getParagraphStyle = function( name ) {
            var i;
            var style = this.paragraphStyles.itemByName( name );
            if (!style.isValid) {
                i = this.paragraphStyleGroups.length;
                while (i) {
                    i -= 1;
                    style = getParagraphStyle.call( this.paragraphStyleGroups[i], name );
                }
            }
            return style; //     If we haven't found a style with name "name", 
                        //     getParagraphStyle will return an invalid object.
        }
        util.addMethodToPrototypes( util.getParagraphStyle, "getParagraphStyle", Document );
        
        
        util.removeDeep = function() {
            var src = this.source;
            var dest = this.destination;
            if (dest)
                var destHidden = dest.hidden;

            this.remove();
            if (src) 
                src.remove();
            if (dest && !destHidden) 
                dest.remove();
        };

        util.addMethodToPrototypes( util.removeDeep, "removeDeep", Hyperlink );
        
        util.multiChangeGrep = function (findChangeArray) {
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
        
        util.addMethodToPrototypes( util.multiChangeGrep, "multiChangeGrep",
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
        
        util.multiReplace = function (findChangeArray) {
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
        
        util.addMethodToPrototypes( util.multiReplace, "multiReplace", String );

    })();
}