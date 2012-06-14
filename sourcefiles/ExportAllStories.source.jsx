// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


// This script is designed to be run in InCopy only.  I will make a more generalized version of it soon.


(function() { // namespace protection wrapper
    
    
  var STORIES_TO_IGNORE = ['News (continued):'];

  // -------------------------------------------

  if (app.name != "Adobe InCopy") error_exit ("The current version of this script is designed to be run only in InCopy.  " +
                                              "I'll make a more generalized version of it soon.");
                                              
  if (app.documents.length < 1) error_exit ("Please open a document and try again.");

  var mySourceDoc = app.activeDocument;  
  var myStoryArray = mySourceDoc.stories.everyItem().getElements();
  var myStory, st, p; 

  // Ignore stuff on pasteboards, stuff in master pages, and stories with specific text.
  var myPage;
  for (st=myStoryArray.length-1; st>=0; st--) {
    myStory = myStoryArray[st];
    myPage = myStory.textContainers[0].parentPage;
    if ((myPage == null) 
    || (myPage.parent.constructor.name == "MasterSpread") 
    || (inArray(myStory.contents, STORIES_TO_IGNORE))) {
      myStoryArray.splice (st,1);
    }
  }
  function inArray (item, array) {
      for (var i = 0; i < array.length; i++) {
          if (item === array[i]) return true;
      }
      return false;
  }

  // Sort by how high in the document it starts.
  myStoryArray.sort (function (A,B) {
    var AFirstFrame = A.textContainers[0];
    var BFirstFrame = B.textContainers[0];
    if (AFirstFrame.parentPage.documentOffset > BFirstFrame.parentPage.documentOffset) { // if it's on a later page
      return 1;
    }
    else if (AFirstFrame.parentPage.documentOffset < BFirstFrame.parentPage.documentOffset) {  // if it's on an earlier page
      return -1;
    } 
    else if (AFirstFrame.geometricBounds[0] > BFirstFrame.geometricBounds[0]) {  // they're on the same page but one is higher
      return 1;
    }
    else return -1; 
  });
  
  // Grab all text from myStoryArray and put it into myTargetStory
  var myTargetDoc = app.documents.add ();
  var myTargetStory = myTargetDoc.pages[0].textFrames[0].parentStory; // There will be one in InCopy, automatically.

  var st;
  for (st=0; st<myStoryArray.length; st++) {
    myStoryArray[st].duplicate (LocationOptions.AT_END, myTargetStory);
    myTargetStory.insertionPoints[-1].contents = "\r\r";
  }

  // Change all paragraphs to 'Keep all lines together'.
  for (p = myTargetStory.paragraphs.length - 1; p >= 0; p--) {
    myTargetStory.paragraphs[p].keepAllLinesTogether = true;
    
  //  debugging:
  //  $.writeln('keepAllLinesTogether: ' + myTargetStory.paragraphs[p].keepAllLinesTogether + ': ' + myTargetStory.paragraphs[p].contents);
  }

  function error_exit (message) {
    if (arguments.length > 0) alert (unescape(message));
    exit();
  } 

// -------------------------------------------

})();  // end namespace protection wrapper
