#targetengine "MyStartupItems"

// This script installs menu items and is based on a similar script
// by Marc Autret.

(function () {
	
	// THE DATA
	
	var ourMenuItems = {
		exportAllStories: {
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportAllStories.jsx",
	    title: "Export All Stories",
	    enabledTest: function() {
	    	return app.documents.length>0;
	    },
	    menuID: "$ID/&File",
	    separatorAbove: true,
		}, 
		exportMarkdown: {
			scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportMarkdown.jsx",
	    title: "Export To Markdown",
	    enabledTest: function() {
	    	return app.documents.length>0 && app.selection.length>0;
	    },
	    menuID: "$ID/&File",
	    separatorAbove: true,
		},
	}
	
	// THE FUNCTIONS
	
	// Create handlers for a menu item
	function assignHandlers (myMenuItem) {
		var result = {};
		result.beforeDisplay = function (ev) {
		 	ev.target.enabled = myMenuItem.enabledTest();
	  }
	  result.onInvoke = function () {
		  app.doScript (myMenuItem.scriptPath);
		}
	  return result;
  }
  
  // Install a menu item
	function installMenuItem (myMenuItem) {
		
	  // 1. Create the script menu action
	  var menuAction = app.scriptMenuActions.add(myMenuItem.title);
	   
	  // 2. Attach the event listener
	  for (var myEvent in myMenuItem.handlers) {
	    menuAction.eventListeners.add(myEvent, myMenuItem.handlers[myEvent]);
	  }
	   
	  // 3. Create the menu item
	  var myMenu = app.menus.item("$ID/Main").submenus.item(myMenuItem.menuID);
	  if (myMenuItem.separatorAbove) {
	    myMenu.menuSeparators.add();
	  }
	  myMenu.menuItems.add(menuAction);
	   
	  return true;
	}
	
	// MAKE IT SO
	
	for (var i in ourMenuItems) {
		ourMenuItems[i].handlers = assignHandlers(ourMenuItems[i]);
		// menuInstalled will be undefined and resolve to false if 
		// we're starting a new session of InDesign.
		ourMenuItems[i].menuInstalled = ourMenuItems[i].menuInstalled || 
		        installMenuItem(ourMenuItems[i]); 
	}
	
})();



// ourScripts.exportAllStories.menuInstaller = exportAllStories.menuInstaller || installMenuItem (ourScripts.exportAllStories);
// ourScripts.exportMarkdown.menuInstaller = exportMarkdown.menuInstaller || installMenuItem (ourScripts.exportMarkdown);
