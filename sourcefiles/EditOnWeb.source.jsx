// This script depends upon the user having previously run
// the AddURLToStory script on a story. This script finds that
// URL (via the extractLabel method) and opens a browser to that page.

// This is useful for going to a page in a CMS that is associated with a story.

function openInBrowser(/*str*/ url) {
    
    // function openInBrowser was adapted by Marc Autret
    // from a script by Gerald Singelmann.

    var isMac = (File.fs == "Macintosh"),
        fName = 'tmp' + (+new Date()) + (isMac ? '.webloc' : '.url'),
        fCode = isMac ?
               ('<?xml version="1.0" encoding="UTF-8"?>\r'+
               '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '+
               '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\r'+
               '<plist version="1.0">\r'+
               '<dict>\r'+
                    '\t<key>URL</key>\r'+
                    '\t<string>%url%</string>\r'+
               '</dict>\r'+
               '</plist>') :
               
               '[InternetShortcut]\rURL=%url%\r';

    var f = new File(Folder.temp.absoluteURI + '/' + fName);
    if(! f.open('w') ) return false;

    f.write(fCode.replace('%url%',url));
    f.close();
    f.execute();
    $.sleep(500);     // 500 ms timer
    f.remove();
    return true;
}

function equalsIn( value, array ) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (value === array[i]) return true;
    }
    return false;
}

function alertExit( message ) {
    if (message) {
        alert( unescape( message ));
    }
    exit();
}

if (app.selection.length === 0) {
    alertExit( "Please select something and try again.");
} else if (app.selection.length > 1) {
    alertExit( 'Please select some text or a text frame (only one) and try again.');
}

var mySelection = app.selection[0];
if (equalsIn( mySelection.constructor.name, 
             ["Character", "Word", "TextStyleRange", "Line",
              "Paragraph", "TextColumn", "Text",
              "InsertionPoint", "TextFrame", "Story"])) {
                  
    var myStory = (mySelection.constructor.name === "Story") ? mySelection :
                   mySelection.parentStory;
                   
	var myURI = myStory.extractLabel( "URI" );
	if (myURI === "") {
	    alertExit( "This story has not been linked to a webpage yet. " +
	               "Run the script 'AddURLToStory' and then try again." );
	}
	openInBrowser ( myURI );
	
} else {
    alertExit( "Please select some text or a text frame and try again." );
}

