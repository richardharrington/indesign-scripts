#targetengine "MyStartupItems"

#include "../util.jsx"

// /Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts

// This script installs menu items and is a generalization of a script
// by Marc Autret, found at 
// http://www.indiscripts.com/post/2010/02/how-to-create-your-own-indesign-menus

;

(function () {
    
    // NAMESPACE ABBREVIATION
    
    var util = FORWARD.Util;
    
    // THE DATA
    
    var ourMenuItems = [
    
        {
            scriptFile: File (app.activeScript.parent.parent.parent + "/ExportAllStories.jsx"),
            title: "Export All Stories",
            menuID: "$ID/&File",
            separatorAbove: true,
            enabledTest: function() {
                return app.documents.length > 0;
            }
        }, 
        
        {
            scriptFile: File (app.activeScript.parent.parent.parent + "/ExportMarkdown.jsx"),
            title: "Export To Markdown",
            menuID: "$ID/&File",
            separatorAbove: true,
            enabledTest: function() {
                return (app.documents.length > 0) && (app.selection.length > 0);
            }
        },
        
        {
            scriptFile: File (app.activeScript.parent.parent.parent + "/AddOrEditHyperlink.jsx"),
            title: "Add/Edit Hyperlink",
            menuID: "$ID/&Edit",
            separatorAbove: true,
            enabledTest: function() {
                
                // Make sure selection exists and is some kind of text object.       
    
                if ((app.documents.length === 0) || (app.selection.length === 0)) {
                    return false;
                }
                
                if (!util.selectionIs( "Character", "Word", "TextStyleRange", "Line",
                                       "Paragraph", "TextColumn", "Text", "Cell",
                                       "Column", "Row", "Table", "InsertionPoint" )) {
                    return false;
                }
                
                // Parent story of selection must be checked out or unmanaged.
               
                var parentStory = app.selection[0].parentStory;
                if (parentStory.lockState === LockStateValues.CHECKED_IN_STORY || parentStory.lockState === LockStateValues.LOCKED_STORY) {
                    return false;
                }
      
                // return false (not enabled) if the selection is an insertion point and 
                // we're not editing one and only one existing hyperlink,
                // otherwise return true.
      
                var foundHyperlinks = util.findHyperlinks( app.selection[0] );
        
                // If we're creating a new hyperlink (not editing an existing one),
                // return true as long as we're not trying to create one on an insertion point. 
        
                if (!foundHyperlinks || (foundHyperlinks.length === 0)) {
                    return !util.selectionIs( "InsertionPoint" );
                }
            
                // Can't edit more than one hyperlink at a time. 
        
                if (foundHyperlinks.length > 1) {
                    return false;
                }
                
                return true;
            }
        },
                    
        {
            scriptFile: File (app.activeScript.parent.parent.parent + "/RemoveHyperlink.jsx"),
            title: "Remove Hyperlink",
            menuID: "$ID/&Edit",
            separatorAbove: false,
            enabledTest: function() {

                // Make sure selection exists and is some kind of text object.       
    
                if ((app.documents.length === 0) || (app.selection.length === 0)) {
                    return false;
                }
                
                if (!util.selectionIs( "Character", "Word", "TextStyleRange", "Line",
                                       "Paragraph", "TextColumn", "Text", "Cell",
                                       "Column", "Row", "Table", "InsertionPoint" )) {
                    return false;
                }
                
                // Parent story of selection must be checked out or unmanaged.
               
                var parentStory = app.selection[0].parentStory;
                if (parentStory.lockState === LockStateValues.CHECKED_IN_STORY || parentStory.lockState === LockStateValues.LOCKED_STORY) {
                    return false;
                }
      
                // Make sure we have selected at least one hyperlink.
            
                var foundHyperlinks = util.findHyperlinks( app.selection[0] );
                return foundHyperlinks && (foundHyperlinks.length > 0);
            }
        }
    ];
    
    // THE FUNCTIONS
    
    // Create handlers for a menu item
    function assignHandlers( myMenuItem ) {
        var result = {};
        result.beforeDisplay = function ( event ) {
            event.target.enabled = myMenuItem.enabledTest();
        }
        result.onInvoke = function () {
            app.doScript (myMenuItem.scriptFile);
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
        
        ourMenuItems[i].menuInstalled = ourMenuItems[i].menuInstalled || installMenuItem( ourMenuItems[i] ); 
    }
    
})();




