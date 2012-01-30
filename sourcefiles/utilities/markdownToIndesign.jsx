// This module needs the module FORWARD.Util contained in the file util.jsx.
// Scripts that #include this one should #include that one first.
// Some day I'm going to figure out if we can do conditional 
// module-loading in InDesign.

// This module interface will be just one function, as opposed to an object with different
// properties referring to various functions.

;

var FORWARD = FORWARD || {};

if (!FORWARD.markdownToIndesign) {
    
    var util = FORWARD.Util;

    FORWARD.markdownToIndesign = (function() {
        
        // The function markdownToIndesign() is given an object containing a block
        // of text, and it finds all the hyperlinks inside the text
        // that are in markdown format and converts them to 
        // InDesign Hyperlink format (i.e., it removes each URL from
        // the text itself and puts it into an InDesign Hyperlink).
        
        markdownToIndesign = function( hyperlinkProperties, /*bool*/ killRedundantIndesignHyperlinks, killAllIndesignHyperlinks ) {

            // Set defaults for parameters
                
            if (arguments.length < 3) 
                var killAllIndesignHyperlinks = false;
            if (arguments.length < 2) 
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
                // $.writeln (this); // debugging
                myDoc = this.parentStory.parent;
                
            }
            if (myDoc.characterStyles.item (myItalicCharacterStyleName) == null) {
                myDoc.characterStyles.add ({name: myItalicCharacterStyleName, appliedFont: "ITC Slimbach", fontStyle: "Book Italic" });
            }
            
            // Now for the main part of this markdownToIndesign function.
            
            // escapedChars is an object that provides objects with find/change pairs for changeGrep.
            // It is designed so that as we add functionality, and more kinds of characters that we 
            // want to escape out before running the main part of this script, we can just add them here.
            
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
            }; 
            
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
              
            this.multiChangeGrep (escapedChars.getHidingPairs());
              
            // Go through the hyperlinks in the passed object and either kill them or set them
            // to our style, depending on the killAllHyperlinks parameter.
            
            var myFoundHyperlinks = util.findHyperlinks( this );
            if (myFoundHyperlinks.length > 0) {
                for (var h = myFoundHyperlinks.length-1; h >= 0; h--) {
                    var link = myFoundHyperlinks[h];
                    if (killAllIndesignHyperlinks) {
                        util.removeHyperlinkDeep(link);
                    }
                    else {
                        link.properties = hyperlinkProperties;
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
                        
                    myRedundantHyperlinks = util.findHyperlinks( myLinkText );
                    if (myRedundantHyperlinks.length > 0) {
                        for (var r=myRedundantHyperlinks.length-1; r>=0; r--) {
                            util.removeHyperlinkDeep(myRedundantHyperlinks[r]);
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
                    myHyperlink.properties = hyperlinkProperties;
                    myHyperlink.destination.destinationURL = myLinkText.contents.match (/\(([^)]+)\)/) [1];
                  
                    // Restore escaped characters in URL
                  
                    myHyperlink.destination.destinationURL = 
                    myHyperlink.destination.destinationURL.multiReplace (escapedChars.getRestoringPairs());
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
              
            this.multiChangeGrep (escapedChars.getRestoringPairs());
              
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences = NothingEnum.nothing;
        };    
        
        return markdownToIndesign;
    })();
    
    util.addMethodToPrototypes( FORWARD.markdownToIndesign, "markdownToIndesign", 
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
};
