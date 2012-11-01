// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


/* This script creates identical (except for the filenames) top-level
   wrapper scripts for all the scripts in the sourcefiles folder.
   These wrapper scripts can then be run in place of the other scripts.
   The benefit of this is that they appear as one step in the undo menu.
   
*/

#include ../util.jsx

var util = FORWARD.Util;


// ------------------------------------------------------------------------------------

// Get the folders.
var thisFolder = app.activeScript.parent; 
var sourceFilesFolder = thisFolder.parent.parent;
var topLevelFolder = sourceFilesFolder.parent;

// Set the wrapper build script (MAKE THIS A CONFIG AT THE TOP).
var wrapperScriptTemplateFile = File( thisFolder.fullName + '/wrapperScriptTemplate.jsx' );
    
// Get the list of all sourcefiles in the sourcefiles folder.
var sourceFiles = sourceFilesFolder.getFiles("*.source.jsx");

util.forEach( sourceFiles, function( file ) {
	wrapperFile = File( (topLevelFolder.fullName + '/' + file.name.replace( '.source', '' )));
	if (!wrapperFile.exists) {
		wrapperScriptTemplateFile.copy( wrapperFile );
	}
});	