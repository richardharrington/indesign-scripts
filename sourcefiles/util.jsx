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

        Util.errorExit = function( message ) {
            if (arguments.length > 0) alert(unescape(message));
            exit();
        };
        
        Util.error_exit = Util.errorExit; // Delete this when we swap out the old underscore usage.

        
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
        
        Util.addLeadingZeroes = function(myNum, numDigits) {  
            
            var myStr = "" + myNum;
            var numZeros = numDigits - myStr.length;

            for (var i = 0; i < numZeros; i++) {
                myStr = "0" + myStr;
            }
            return myStr;
        };
        Util.add_leading_zeros = Util.addLeadingZeroes; // Delete this after we replace all the old references.
        
            
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
        
        Util.getParagraphStyle = function( name ) {
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
        Util.addMethodToPrototypes( Util.getParagraphStyle, "getParagraphStyle", Document );
        
        
        Util.removeDeep = function() {
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

        Util.addMethodToPrototypes( Util.removeDeep, "removeDeep", Hyperlink );
        
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
        
        Util.addMethodToPrototypes( Util.multiChangeGrep, "multiChangeGrep",
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
        
        Util.addMethodToPrototypes( Util.multiReplace, "multiReplace", String );

    })();
}
