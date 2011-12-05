#targetengine "MyStartupItems"


var error_exit = function( message ) {    if (arguments.length > 0) alert(unescape(message));    exit();}


var selectionIs = function( /* further argument list of valid constructor names for the selection */) {
	
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
		
// Returns an array of hyperlink objects whose source texts
// are wholly or partially contained within the textObj argument.
var findHyperlinks = function(textObj) {
	
	var textObjParentStory = (textObj.constructor.name == "Story") ? textObj : textObj.parentStory;
	
	var doc = textObjParentStory.parent;

  var foundLinks = [];  for (var linkIndex = doc.hyperlinks.length - 1; linkIndex >= 0; linkIndex--) {    var link = doc.hyperlinks[linkIndex];    var linkText = link.source.sourceText;
        // If linkText is in the same story as textObj,     // and linkText is neither entirely before     // textObj nor entirely after it, then...
        if ((linkText.parentStory == textObjParentStory)             && ( ! ((linkText.index + linkText.length <= textObj.index)              || (linkText.index >= textObj.index + textObj.length))) ) {      foundLinks.push(link);    }  }  return foundLinks;}
		

var addOrEditHyperlink = function() {
	
	// namespace abbreviation
	

		var DEFAULT_HYPERLINK_PROPERTIES = {
			  borderColor: [183, 27, 23],  // Burgundy, roughly.
		  	borderStyle: HyperlinkAppearanceStyle.DASHED,
		    width: HyperlinkAppearanceWidth.THIN,
		    visible: true,
		}
		
		function getTextSelection() {
		
		    if (app.documents.length == 0) {
		    	  error_exit("No documents are open.  Please open a document and try again.");
		    }		    if (app.selection.length == 0) {
		    	  error_exit("Please select something and try again.");
		    }
		    
		    var myObject;
		    var mySel = app.selection[0];
		    		    switch (mySel.constructor.name) {		    case "Character":		    case "Word":		    case "TextStyleRange":		    case "Line":		    case "Paragraph":		    case "TextColumn":		    case "Text":		    case "Cell":		    case "Column":		    case "Row":		    case "Table":
		    case "InsertionPoint":
		        myObject = mySel;
		        break;
		        		    case "TextFrame":		        error_exit ("Please select some text (not a whole text frame) and try again.");		        break;
		        		    case "Story":		        error_exit ("Please select some text (not a whole story) and try again.");		        break;
		        		    default:
		        error_exit("Please select some text and try again.");		    				    if (!myObject.isValid) {
					    	error_exit( "There's been an error of indeterminate nature.  " + 
				    	                   "Probably best to blame the programmer." );
				    }
		    }
				    
		    return myObject;
		    
		}
		
		
		var myDisplayDialog = function( defaultText ) {
			
			  var defaultText = defaultText || "";
		    
		    var myDialog = app.dialogs.add({		        name: "Type in a URL"		    });
		    
		    var myOuterColumns = [];
		    var myInnerColumns = [];
		    var myOuterRows = [];
		    var myBorderPanels = [];
		    var myTextEditboxes = [];
		    var myInput;
		    		    myOuterColumns[0] = myDialog.dialogColumns.add();		    myOuterRows[0] = myOuterColumns[0].dialogRows.add();				    myBorderPanels[0] = myOuterRows[0].borderPanels.add();		    myInnerColumns[0] = myBorderPanels[0].dialogColumns.add();		    myInnerColumns[0].staticTexts.add({		        staticLabel: "URL:"		    });
		    
		    myInnerColumns[1] = myBorderPanels[0].dialogColumns.add();		        
		    myTextEditboxes[0] = myInnerColumns[1].textEditboxes.add({
		    	  minWidth: 300,
		    	  editContents: defaultText ? defaultText : "http://"
		    });
		    
		    var myResult = myDialog.show();		    var myInput = myTextEditboxes[0].editContents;
		    
//		    myDialog.destroy();
		    
		    if (myResult == false) {
			    	exit();
		    }
		    
		    return myInput;
		
		}
		
		
		var myHyperlink;
		var mySource;
		var myDest, destURL = "";
		
		var mySel = getTextSelection();
		
		// We've already determined that it's not a Story object, 
		// so we don't have to test for that.
		
		var myDoc = mySel.parentStory.parent;
		
		var myFoundHyperlinks = findHyperlinks (mySel);
		
		// Check to see if there are already any hyperlinks in the selection.
		
		if (myFoundHyperlinks.length > 0) {
			
				if (myFoundHyperlinks.length > 1) {
						error_exit ("The text you've selected contains more than one hyperlink. " + 
					                   "Please select some text with one hyperlink, or no hyperlinks, and try again.");
				}
				
				// Now we know we're editing a hyperlink, not adding one.
				
				myHyperlink = myFoundHyperlinks[0];
				destURL = myHyperlink.destination.destinationURL;
			
		} else {
				
				// If we're creating a new hyperlink, then the selection cannot
				// be an insertion point:
				
				if (mySel.constructor.name == "InsertionPoint") {
					  error_exit("Please select some text and try again.");
				}
		}	
		
		var finished = false;
		var userInput;


		
				while (!finished) {
					  $.writeln("Beginning of the while loop. destURL is: " + destURL + ". We will crash on the next line, if " +
					            "this is the second time through the while loop:");
					  
						userInput = myDisplayDialog( destURL );
						
						// Check if it's a reasonable URL.
						
						if (userInput && userInput.match( /(https?\:\/\/)?[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?$/ ) ) {
								
								// If the person neglected the "http://", add it
								
								myMatch = userInput.match( /^https?\:\/\// );
								destURL = myMatch ? userInput : ("http://" + userInput);
								
							  // If we're adding to an already existing link:
							  
							  if (myHyperlink) {
							  	  myHyperlink.destination.destinationURL = destURL;
							  }
							  
							  // If we're creating a new link:
							  
							  else {
						
						 	    	myDest = myDoc.hyperlinkURLDestinations.add( destURL );
							  	  mySource = myDoc.hyperlinkTextSources.add ( mySel );
							  	  
							      myHyperlink = myDoc.hyperlinks.add( mySource, myDest, DEFAULT_HYPERLINK_PROPERTIES );
							      myHyperlink.name = mySource.sourceText.contents.slice( 0, 20 );
							      
							      // debugging line
							      
							      $.writeln( myHyperlink.name );
								}; 
						
								finished = true;
							
						} else {
							alert ("Please type in a valid URL and try again.");
						}
				}
    $.writeln("We've gotten all the way to the end. Why must we crash?");
		
};

		




// TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING 
// start of menu installer






(function () {
	
	// NAMESPACE ABBREVIATION
	
	
	// THE DATA
	
	var ourMenuItems = [
	
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/sourcefiles/AddOrEditHyperlink.source test.jsx",
			func: addOrEditHyperlink,
	    title: "Add/Edit Hyperlink",
	    menuID: "$ID/&Edit",
	    separatorAbove: true,
	    enabledTest: function() {
	    	
	    	// selection can be any kind of text object.
	    	
	    	return (app.documents.length > 0) && (app.selection.length > 0) && 
	              selectionIs( "Character", "Word", "TextStyleRange", "Line",
	                                "Paragraph", "TextColumn", "Text", "Cell",
	                                "Column", "Row", "Table", "InsertionPoint"  );
	    }
		},
		
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/sourcefiles/RemoveHyperlink.source beta.jsx",
			func: function() { app.doScript( this.scriptPath ); },
	    title: "Remove Hyperlink",
	    menuID: "$ID/&Edit",
	    separatorAbove: false,
	    enabledTest: function() {

	    	// Need to assemble boolean result in two steps because we can't reference
	    	// app.selection[0] as a parameter in the findHyperlinks call if it doesn't exist.
	    	
	    	// selection can be any kind of text object.
	    	
	    	var partialResult = (app.documents.length > 0) && (app.selection.length > 0) &&
	    	                     Util.selectionIs( "Character", "Word", "TextStyleRange", "Line",
	                                             "Paragraph", "TextColumn", "Text", "Cell",
	                                             "Column", "Row", "Table", "InsertionPoint" );
	    	if (!partialResult) {
	    	    return false;
	    	}
	    	var foundHyperlinks = Util.findHyperlinks( app.selection[0] );
	    	
	    	// Make sure we have selected a hyperlink.
	    	
	    	return foundHyperlinks && (foundHyperlinks.length > 0);
	    }
		}
	];
	
	// THE FUNCTIONS
	
	// Create handlers for a menu item
	function assignHandlers ( myMenuItem ) {
		var result = {};
		result.beforeDisplay = function ( event ) {
		 	event.target.enabled = myMenuItem.enabledTest();
	  }
	  result.onInvoke = myMenuItem.func;

	  return result;
  }
  
  // Install a menu item
	function installMenuItem( myMenuItem ) {
		
	  // 1. Create the script menu action
	  var menuAction = app.scriptMenuActions.add( myMenuItem.title );
	   
	  // 2. Attach the event listener
	  for (var myEvent in myMenuItem.handlers) {
	    menuAction.eventListeners.add( myEvent, myMenuItem.handlers[ myEvent ]);
	  }
	   
	  // 3. Create the menu item
	  var myMenu = app.menus.item( "$ID/Main" ).submenus.item( myMenuItem.menuID );
	  if (myMenuItem.separatorAbove) {
	    myMenu.menuSeparators.add();
	  }
	  myMenu.menuItems.add( menuAction );
	   
	  return true;
	}
	
	// MAKE IT SO
	
	for (var i = 0, len = ourMenuItems.length; i < len; i++) {
	
		ourMenuItems[i].handlers = assignHandlers( ourMenuItems[i] );
		
		// menuInstalled will be undefined and resolve to false if 
		// we're starting a new session of InDesign.
		
		ourMenuItems[i].menuInstalled = ourMenuItems[i].menuInstalled || 
		                                installMenuItem( ourMenuItems[i] ); 
	}
	
})();




