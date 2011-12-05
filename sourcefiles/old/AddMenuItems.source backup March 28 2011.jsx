#targetengine "MyMenuSystem"


// THE CONSTANTS
var exportAllStoriesScriptPath = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportAllStories.jsx";
var exportAllStoriesTitle = "Export All Stories";

var exportMarkdownScriptPath = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/ExportMarkdown.jsx";
var exportMarkdownTitle = "Export Markdown";
 

 
// CREATE THE HANDLERS
// -----------------------------------------------
 
function assignHandlers (scriptPath, enabledTest) {
	 var result = {};
	 result.beforeDisplay = function (ev) {
	 	 ev.target.enabled = enabledTest();
	 }
	 result.onInvoke = function () {
	   app.doScript (scriptPath);
	 }
	 return result;
}
 
var exportAllStoriesHandlers = assignHandlers (exportAllStoriesScriptPath, function() {return app.documents.length>0;});

var exportMarkdownHandlers = assignHandlers (exportMarkdownScriptPath, function() {return app.documents.length>0 && app.selection.length>0;});
 
// INSTALL THE MENUS
// -----------------------------------------------

function installMenuItemAtBottom (mnuTitle, mnuHandlers, MenuID, /*boolean*/ addSeparator)  {
  // 1. Create the script menu action
  var mnuAction = app.scriptMenuActions.add(mnuTitle);
   
  // 2. Attach the event listener
  var ev;
  for( ev in mnuHandlers )
      {
      mnuAction.eventListeners.add(ev,mnuHandlers[ev]);
      }
   
  // 3. Create the menu item
  var ourMenu = app.menus.item("$ID/Main").submenus.item(MenuID);
  // var refItem = fileMenu.menuItems.item("$ID/&Close");
   
  if (addSeparator) ourMenu.menuSeparators.add();
  ourMenu.menuItems.add(mnuAction);
   
  return true;
}

var exportAllStoriesMenuInstaller = exportAllStoriesMenuInstaller ||
installMenuItemAtBottom (exportAllStoriesTitle, exportAllStoriesHandlers, "$ID/&File", true);
 
var exportMarkdownMenuInstaller = exportMarkdownMenuInstaller ||
installMenuItemAtBottom (exportMarkdownTitle, exportMarkdownHandlers, "$ID/&File", false);
 
 
 
// })();  // end of namespace protection wrapper


