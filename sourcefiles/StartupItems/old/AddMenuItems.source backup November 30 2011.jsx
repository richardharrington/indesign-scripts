#targetengine "MyStartupItems"

#include "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/sourcefiles/utilities/util.jsx"

// This script installs menu items and is a generalization of a script
// by Marc Autret, found at 
// http://www.indiscripts.com/post/2010/02/how-to-create-your-own-indesign-menus

;

(function () {
	
	// NAMESPACE ABBREVIATION
	
	var Util = FORWARD.Util;
	
	// THE DATA
	
	var ourMenuItems = [
	
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportAllStories.jsx",
	    title: "Export All Stories",
	    menuID: "$ID/&File",
	    separatorAbove: true,
	    enabledTest: function() {
	    	  return app.documents.length > 0;
	    }
		}, 
		
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportMarkdown.jsx",
	    title: "Export To Markdown",
	    menuID: "$ID/&File",
	    separatorAbove: true,
	    enabledTest: function() {
	    	  return (app.documents.length > 0) && (app.selection.length > 0);
	    }
		},
		
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/sourcefiles/AddOrEditHyperlink.source.jsx",
	    title: "Add/Edit Hyperlink",
	    menuID: "$ID/&Edit",
	    separatorAbove: true,
	    enabledTest: function() {
	    	
	    	// selection can be any kind of text object, including an insertion point 
	    	// in the case of editing an existing hyperlink, but not including an 
	    	// insertion point in the case of creating a new hyperlink.
	    	
	    	var partialResult = (app.documents.length > 0) && (app.selection.length > 0) && 
	                           Util.selectionIs( "Character", "Word", "TextStyleRange", "Line",
	                                             "Paragraph", "TextColumn", "Text", "Cell",
	                                             "Column", "Row", "Table", "InsertionPoint"  );
	      if (!partialResult) {
	      	return false;
	      }
	      
	      // return false (not enabled) if the selection is an insertion point and 
	      // we're not editing an existing hyperlink,
	      // otherwise return true.
	      
	      var foundHyperlinks = Util.findHyperlinks( app.selection[0] );
	      return Util.selectionIs( "InsertionPoint" ) ? (foundHyperlinks && (foundHyperlinks.length > 0)) : true;

	    }
		},
		
		{
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/sourcefiles/RemoveHyperlink.source.jsx",
	    title: "Remove Hyperlink",
	    menuID: "$ID/&Edit",
	    separatorAbove: false,
	    enabledTest: function() {

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
	  result.onInvoke = function () {
		  app.doScript (myMenuItem.scriptPath);
		}
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




