// Set to 6.0 scripting object model (Indesign CS4)app.scriptPreferences.version = 6.0;


//DivideStory.jsx//a modification of the DivideStory.jsx script from Dave Saunders' website, combined with the error-checking from //the SplitStory.jsx script that comes with Indesign CS4.  I have removed the part of Dave Saunders'//script that allows for tables, because we will never need that.  The reason I have separated out the dividing//from the selecting and error-checking is that I might use this divideStory function in another script,//in which the textFrame to be divided is picked by the script, not by the user.//- Richard Harrington 2010

// P.S. I also added an optional part (activated by the boolean argument solidifyJumplines) where it takes 
// already existing jump lines, // in the Forward's format, and makes the page
// numbers into numerals of text instead of special PreviousPageNumber and NextPageNumber characters.// The variable solidyJumplines defaults to true.
main();function main() {    //Make certain that user interaction (display of dialogs, etc.) is turned on.    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;    
    if (app.documents.length == 0) 
    	error_exit ("Please open a document and try again.");
    if (app.selection.length == 0) 
    	error_exit ("Please select a text frame and try again.");  
    	  
    var mySelection = app.selection[0];	
    if (mySelection.constructor.name != "TextFrame") 
    	error_exit ("Please select a text frame and try again.");     if(mySelection.parentStory.textContainers.length == 1) 
    	error_exit ("Please select a story containing more than one text frame and try again.");    if(real_text_frame_index (mySelection) == 0) 
    	error_exit ("Please select some other text frame besides the first one in the chain, and try again.");

    divide_story (mySelection);}function divide_story (myFrame, solidifyJumplines) {    //Splitting the story is a two-step process: first, duplicate    //the text frames, second, delete the original text frames.    var myStory = myFrame.parentStory;
    var mySplit = real_text_frame_index (myFrame);
    var myTot = myStory.textContainers.length;        // Work from the back    var myStart = myTot - 1;    var myEnd = mySplit;        var myPreJumpPage, myPostJumpPage;    var myPreJumpParagraph, myPostJumpParagraph;        if (arguments.length < 2) var solidifyJumplines = true; // defaults to true        if (solidifyJumplines) {
      myPreJumpPage = find_page (myFrame.previousTextFrame);      myPostJumpPage = find_page (myFrame);
    }        // If there are more than two textFrames in the story    if (myStart > myEnd) {        var myPrevFrame = split_me(myStory.textContainers[myStart]);        for (var i = myStart-1; i > myEnd; i--) {            var myNewFrame = split_me(myStory.textContainers[i]);            myPrevFrame.previousTextFrame = myNewFrame;            myPrevFrame = myNewFrame;        }    }    // Now we deal with the last frame    myFrame = myStory.textContainers[myEnd];
    try {        var myIndex = myFrame.characters[0].index;        var storyEnd = myStory.length - 1;        var myText = myStory.texts[0].characters.itemByRange(myIndex,storyEnd);    } catch (e) { } // Ignore; happens if last character is a table or frames are empty.
    
    
    myNewFrame = myFrame.duplicate();    try {myText.remove();} catch(e){} //ignore empty frame    myFrame.remove();    try {myPrevFrame.previousTextFrame = myNewFrame;} catch(e){} //fails if one frame only
    
    // FROM HERE ON IN THE MAIN() FUNCTION IS THE PART THAT I HAVE ADDED
    // TO DAVE SAUNDERS' ORIGINAL SCRIPT.    
    // Remove the last paragraph break from the jumped-from story, if it exists.     if (myStory.characters[-1].contents == "\r") {        myStory.characters[-1].remove();    }        // Now we deal with the changing the page numbers in jumplines from special page number characters into text.
    if (solidifyJumplines) {
        myPreJumpParagraph = myStory.paragraphs[-1];
        if (myPreJumpParagraph.appliedParagraphStyle.name.match(/jumpline/i)) {            // replace the special character after the word "page "            myPreJumpParagraph.characters[myPreJumpParagraph.contents.indexOf("page ")+5].contents = myPostJumpPage.name;        }	        myPostJumpParagraph = myNewFrame.parentStory.paragraphs[0];        if (myPostJumpParagraph.appliedParagraphStyle.name.match(/jumpline/i)) {            // replace the special character after the word "page "            myPostJumpParagraph.characters[myPostJumpParagraph.contents.indexOf("page ")+5].contents = myPreJumpPage.name;        }
    }}

function split_me(myFrame) {    myDupeFrame = myFrame.duplicate();    while(myDupeFrame.contents.length > 0) {        myDupeFrame.texts[0].remove();    }    myFrame.remove();    return myDupeFrame;}function error_exit (message) {    if (arguments.length > 0) alert (unescape(message));    exit();} 


// The following function is a replacement for the textFrameIndex property of the TextFrame object.
// The textFrameIndex property counts the number of columns in all the text boxes in the story, not the number of 
// text frames.  In my humble opinion, this is a huge bug.

function real_text_frame_index (myFrame) {
	var i;
	var myStory;
	
	myStory = myFrame.parentStory;
	for (i=0; i < myStory.textContainers.length; i++) 
		if (myStory.textContainers[i] == myFrame) 
			return i;
}
	

// By Dave Saunders//var myDoc = app.activeDocument;//var myObj = app.selection[0];//$.write("The selected object is on page " + findPage(myObj).name + "\n") ; function find_page(theObj) {     var thePage = theObj;     if (thePage.hasOwnProperty("baseline")) {       thePage = thePage.parentTextFrames[0];     }     while (thePage.constructor.name != "Page") {       var whatIsIt = thePage.constructor.name;       switch (whatIsIt) {         case "Story" :           thePage = thePage.textFrames[-1].parent;           break;         case  "Character" :           thePage = thePage.parentTextFrames[0];           break;         case "Cell" :           try {             thePage = thePage.insertionPoints[0].parentTextFrames[0];             break;           } catch (e) {             // must be overset, so ignore             return null;           }         case "Application" :           // must be off page, so ignore           return null;       }       thePage = thePage.parent;     }     return thePage   }