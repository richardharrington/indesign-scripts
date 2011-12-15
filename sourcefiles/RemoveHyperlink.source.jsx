/* 

This script performs one of two functions: either
it creates a new hyperlink on the selected text,
or it edits an existing one.

*/


#include util.jsx

;






(function() {

    // Namespace abbreviation
    
    var Util = FORWARD.Util;

    
    function getTextSelection() {
    
        if (app.documents.length == 0) {
              Util.error_exit("No documents are open.  Please open a document and try again.");
        }
        if (app.selection.length == 0) {
              Util.error_exit("Please select something and try again.");
        }
        
        var myObject;
        var mySel = app.selection[0];
        
        switch (mySel.constructor.name) {
        case "Character":
        case "Word":
        case "TextStyleRange":
        case "Line":
        case "Paragraph":
        case "TextColumn":
        case "Text":
        case "Cell":
        case "Column":
        case "Row":
        case "Table":
        case "InsertionPoint":
            myObject = mySel;
            break;
            
        case "TextFrame":
            Util.error_exit ("Please select some text (not a whole text frame) and try again.");
            break;
            
        case "Story":
            Util.error_exit ("Please select some text (not a whole story) and try again.");
            break;
            
        default:
            Util.error_exit("Please select some text and try again.");
        
                if (!myObject.isValid) {
                    Util.error_exit( "There's been an error of indeterminate nature.  " + 
                                     "Probably best to blame the programmer." );
                }
        }
                
        if (myObject.parentStory.lockState == LockStateValues.CHECKED_IN_STORY || 
                myObject.parentStory.lockState == LockStateValues.LOCKED_STORY) {
            Util.error_exit ("Please check out the story you're trying to place text into, and try again.");
        }
                
        return myObject;
        
    }
    
    
    var myHyperlink;
    var myDest;
    var myDestHidden;
    var mySource;
    var numLinks;
    var myFoundHyperlink;
    
    
    var mySel = getTextSelection();
    
    // We've already determined that it's not a Story object, 
    // so we don't have to test for that.
    
    var myDoc = mySel.parentStory.parent;
    
    var myFoundHyperlinks = Util.findHyperlinks (mySel);
    
    // Check to see if there are already any hyperlinks in the selection.
    
    numLinks = myFoundHyperlinks.length;
    
    if (numLinks > 0) { 
        if (confirm( "Are you sure you want to remove the following hyperlink" +
                     ((numLinks > 1) ? "s" : "") + "?\n\n" +
                     (function() {
                           var str = "";
                           for (var i = 0; i < numLinks; i++) {
                               str += myFoundHyperlinks[i].destination.destinationURL + "\n\n";
                           }
                           return str;
                     })() )) {
            
            for (var i = 0; i < numLinks; i++) {
                
                myFoundHyperlink = myFoundHyperlinks[i];
                mySource = myFoundHyperlink.source;
                myDest = myFoundHyperlink.destination;
                myDestHidden = myDest.hidden;
                
                myFoundHyperlink.remove();
                mySource.remove();
                
                // If myDest was NOT hidden, then it was a "shared URL destination" and 
                // it needs to be removed. If it WAS hidden, then the removal of the
                // hyperlink will already have removed the destination and myDest.remove
                // would throw an error.
                if (!myDestHidden) myDest.remove();
            }
        }
        
    } else {
        
        Util.error_exit("Please select a link and try again.");
        
    }   

})();

