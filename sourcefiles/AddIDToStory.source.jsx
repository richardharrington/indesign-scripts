// This function adds an identifier to a story in InDesign or 
// InCopy which allows the script EditOnWeb to find the appropriate
// page on the CMS, for anyone with their cursor in the story.

function error_exit (message) {  if (arguments.length > 0) alert (unescape(message));  exit();} 	
	
		var mySelection = app.selection[0];
if (typeof mySelection == 'undefined') error_exit ('Please select something and try again.');switch (mySelection.constructor.name) {	case "Character":	case "Word":	case "TextStyleRange":	case "Line":	case "Paragraph":	case "TextColumn":	case "Text":	case "InsertionPoint" :	case "TextFrame" :
	  var myStory = mySelection.parentStory;
	  var myInput = prompt ("What is the ID number (or the whole URL) of the web page in the CMS that corresponds to this article?", "");
	  if (myInput == null) exit();
	  var myMatch = myInput.match(/\D/);  // null if it's a number
	  if (myMatch == null) {
	    myStory.label = "http://www.forward.com/symphony/publish/articles/edit/" + myInput;
	    exit();
	  }
	  myMatch = myInput.match(/http:\/\/www\.forward\.com/);
	  if (myMatch != null) {
	    myStory.label = myInput;
	    exit();
	  }
	  
	  // default
	  error_exit ('Please try again and type in a Forward URL or an article ID number (numbers only, no spaces or punctuation.)');
}
	  
