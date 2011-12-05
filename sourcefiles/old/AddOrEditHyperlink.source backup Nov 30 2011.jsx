/* 

This script performs one of two functions: either
it creates a new hyperlink on the selected text,
or it edits an existing one.

*/

#include util.jsx

;

(function() {
	
	// namespace abbreviation
	
	  var Util = FORWARD.Util;

		var DEFAULT_HYPERLINK_PROPERTIES = {
			  borderColor: [183, 27, 23],  // Burgundy, roughly.
		  	borderStyle: HyperlinkAppearanceStyle.DASHED,
		    width: HyperlinkAppearanceWidth.THIN,
		    visible: true,
		}
		
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
				    
		    return myObject;
		    
		}
		
		
		var myDisplayDialog = function( defaultText ) {
		
			  var defaultText = defaultText || "";
		    
		    var myDialog = app.dialogs.add({
		        name: "Type in a URL"
		    });
		    
		    var myOuterColumns = [];
		    var myInnerColumns = [];
		    var myOuterRows = [];
		    var myBorderPanels = [];
		    var myTextEditboxes = [];
		    var myInput;
		    
		    myOuterColumns[0] = myDialog.dialogColumns.add();
		    myOuterRows[0] = myOuterColumns[0].dialogRows.add();
		
		    myBorderPanels[0] = myOuterRows[0].borderPanels.add();
		    myInnerColumns[0] = myBorderPanels[0].dialogColumns.add();
		    myInnerColumns[0].staticTexts.add({
		        staticLabel: "URL:"
		    });
		    
		    myInnerColumns[1] = myBorderPanels[0].dialogColumns.add();
		        
		    myTextEditboxes[0] = myInnerColumns[1].textEditboxes.add({
		    	  minWidth: 300,
		    	  editContents: defaultText ? defaultText : "http://"
		    });
		    
		    var myResult = myDialog.show();
		    var myInput = myTextEditboxes[0].editContents;
		    
//		  myDialog.destroy() cannot be used because of a bug in ID CS5
//		  on 64-bit machines. They totally crash. So we'll just
//		  have the dialog boxes cluttering up non-Javascript-related
//		  InDesign memory, but it's really unlikely to be all that bad.
		    
//		  myDialog.destroy();
		    
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
		
		var myFoundHyperlinks = Util.findHyperlinks (mySel);
		
		// Check to see if there are already any hyperlinks in the selection.
		
		if (myFoundHyperlinks.length > 0) {
			
				if (myFoundHyperlinks.length > 1) {
						Util.error_exit ("The text you've selected contains more than one hyperlink. " + 
					                   "Please select some text with one hyperlink, or no hyperlinks, and try again.");
				}
				
				// Now we know we're editing a hyperlink, not adding one.
				
				myHyperlink = myFoundHyperlinks[0];
				destURL = myHyperlink.destination.destinationURL;
			
		} else {
				
				// If we're creating a new hyperlink, then the selection cannot
				// be an insertion point:
				
				if (mySel.constructor.name == "InsertionPoint") {
					  Util.error_exit("Please select some text and try again.");
				}
		}	
		
		var finished = false;
		var userInput;
		
				while (!finished) {
					  
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
							      
								}; 
						
								finished = true;
							
						} else {
							alert ("Please type in a valid URL and try again.");
						}
				}
		
})();
