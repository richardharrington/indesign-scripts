#targetengine "MyMenuSystem"


// THE CONSTANTS
var exportAllStories = { scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportAllStories.jsx",
                         title: "Export All Stories",
                         enabledTest: function() {return app.documents.length>0;},
                         menuID: "$ID/&File",
                         separatorAbove: true
                       };
                         
var exportMarkdown =   { scriptPath: "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportMarkdown.jsx",
                         title: "Export To Markdown",
                         enabledTest: function() {return app.documents.length>0 && app.selection.length>0;},
                         menuID: "$ID/&File",
                         separatorAbove: true
                       };
 
 
// CREATE THE HANDLERS
// -----------------------------------------------
 
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
 
exportAllStories.handlers = assignHandlers (exportAllStories);
exportMarkdown.handlers = assignHandlers (exportMarkdown);


// INSTALL THE MENUS
// -----------------------------------------------

function installMenuItemAtBottom (myMenuItem)  {
  // 1. Create the script menu action
  var mnuAction = app.scriptMenuActions.add(myMenuItem.title);
   
  // 2. Attach the event listener
  var ev;
  for( ev in myMenuItem.handlers )
      {
      mnuAction.eventListeners.add(ev,myMenuItem.handlers[ev]);
      }
   
  // 3. Create the menu item
  var ourMenu = app.menus.item("$ID/Main").submenus.item(myMenuItem.menuID);
  // var refItem = fileMenu.menuItems.item("$ID/&Close");
   
  if (myMenuItem.separatorAbove) 
    ourMenu.menuSeparators.add();
    
  ourMenu.menuItems.add(mnuAction);
   
  return true;
}

exportAllStories.menuInstaller = exportAllStories.menuInstaller || installMenuItemAtBottom (exportAllStories);
exportMarkdown.menuInstaller = exportMarkdown.menuInstaller || installMenuItemAtBottom (exportMarkdown);
