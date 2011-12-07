// This script calls a sourcefile to run the another script, based on whatever name
// this file has.

// The purpose of this convoluted setup is to add only one step to the Undo menu,
// and to name that step logically.

// So if this file is called myBrilliantScript.jsx, it will run the script 
// ./sourcefiles/myBrilliantScript.source.jsx

(function() { // namespace protection wrapper

	var SOURCEFILE_FOLDER_RELATIVE_PATH = "/sourcefiles";
	var SOURCEFILE_EXTENSION = ".source";
	
	var myScriptFile = getActiveScript();
	var myScriptName = unescape (myScriptFile.name.slice (0, myScriptFile.name.indexOf(".jsx")));
	
	var myScriptSourcefile = File (myScriptFile.parent + 
	                               SOURCEFILE_FOLDER_RELATIVE_PATH + 
	                               "/" + 
	                               myScriptName + 
	                               SOURCEFILE_EXTENSION + 
	                               ".jsx");
	
	app.doScript (myScriptSourcefile, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, myScriptName);	
	function getActiveScript() {	    try {	        var myScript = app.activeScript;	    } catch(e) {	        // we are running from the ESTK	        var myScript = File(e.fileName);	    }	    return myScript;	}})();  
