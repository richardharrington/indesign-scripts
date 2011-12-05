function gotoLink(url){
    url = url || "http://in-tools.com";
    if(false) { //+app.version[0] > 6){
        if(File.fs=="Macintosh"){
            var body = 'tell application "Finder"\r ' +
                       '  open location "'+url+'"\r ' +
                       'end tell ';
            app.doScript(body,ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            var body =  'dim objShell\r ' +
                        'set objShell = CreateObject("Shell.Application")\r ' +
                        'str = "'+url+'"\r ' +
                        'objShell.ShellExecute str, "", "", "open", 1 ';
            app.doScript(body,ScriptLanguage.VISUAL_BASIC);
        }
    }
    else {
        var linkJumper = File(Folder.temp.absoluteURI+"/link.html");
        linkJumper.open("w");
        var linkBody = '<html><head><META HTTP-EQUIV=Refresh CONTENT="0; URL='+url+'"></head><body><p></p></body></html>'
        linkJumper.write(linkBody);
        linkJumper.close();
        linkJumper.execute();
    }
}
 


function error_exit (message) {  if (arguments.length > 0) alert (unescape(message));  exit();} 	
	
		var mySelection = app.selection[0];
if (typeof mySelection == 'undefined') error_exit ('Please select something and try again.');switch (mySelection.constructor.name) {	case "Character":	case "Word":	case "TextStyleRange":	case "Line":	case "Paragraph":	case "TextColumn":	case "Text":	case "InsertionPoint" :	case "TextFrame" :
	  var myStory = mySelection.parentStory;
	  if (myStory.label == "") {
	    error_exit ("This story has not been linked to a webpage in the CMS yet.  Run the script 'AddIDToStory' and then try again.");
	  }
	  gotoLink (myStory.label);
}
	   
