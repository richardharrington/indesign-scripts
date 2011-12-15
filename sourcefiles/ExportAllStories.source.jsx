// This script is designed to be run in InCopy only.  I will make a more generalized version of it soon.


(function() { // namespace protection wrapper

// -------------------------------------------

if (app.name != "Adobe InCopy") error_exit ("The current version of this script is designed to be run only in InCopy.  " +
                                            "I'll make a more generalized version of it soon.");
if (app.documents.length < 1) error_exit ("Please open a document and try again.");

var mySourceDoc = app.activeDocument;  
var myStoryArray = mySourceDoc.stories.everyItem().getElements();
var st; 

// Ignore stuff on pasteboard and on master pages
var myPage;
for (st=myStoryArray.length-1; st>=0; st--) {
  myPage = myStoryArray[st].textContainers[0].parentPage;
  if ((myPage == null) || (myPage.parent.constructor.name == "MasterSpread")) {
    myStoryArray.splice (st,1);
  }
}

// Sort by how high in the document it starts.
var SortStoriesByYVAlue = function (A,B) {
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
}
myStoryArray.sort (SortStoriesByYVAlue);

// Grab all text from myStoryArray and put it into myTargetStory
var myTargetDoc = app.documents.add ();
var myTargetStory = myTargetDoc.pages[0].textFrames[0].parentStory; // There will be one in InCopy, automatically.

var st;
for (st=0; st<myStoryArray.length; st++) {
  myStoryArray[st].duplicate (LocationOptions.AT_END, myTargetStory);
  myTargetStory.insertionPoints[-1].contents = "\r\r";
}


function error_exit (message) {
  if (arguments.length > 0) alert (unescape(message));
  exit();
} 

// -------------------------------------------

})();  // end namespace protection wrapper
