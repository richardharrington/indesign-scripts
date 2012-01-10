/* This script asks the user for a folder
   and unlinks all the stories in all the InDesign
   documents in that folder from their InCopy source files.
   
   This is useful when you have completed a project
   and published it, and you don't want any editors 
   messing with the InDesign documents in InCopy,
   under the mistaken impression that their changes will
   be included in the final version of the project.
   
*/

#include util.jsx

var util = FORWARD.Util;


// ------------------------------------------------------------------------------------

// Get the folders.
var thisFolder = app.activeScript.parent; 
var sourceFilesFolder = thisFolder.parent;
var topLevelFolder = sourceFilesFolder.parent;

// Set the wrapper build script (MAKE THIS A CONFIG AT THE TOP).
var wrapperScriptTemplateFile = File( thisFolder.name + '/wrapperScriptTemplate.jsx' );
    
// Get the list of all sourcefiles in the sourcefiles folder.
var sourceFiles = sourceFilesFolder.getFiles("*.source.jsx");

util.forEach( sourceFiles, function( file ) {
	wrapperFile = File( (topLevelFolder + '/' + file.name.replace( '.source', '' )));
	if (!wrapperFile.exists) {
		wrapperScriptTemplateFile.copy( wrapperFile );
	}
});	