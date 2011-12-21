// CONFIG

var COPYFIT_TEXT_FILE_PATH = "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/COPYFIT diff lengths longer/2000 copyfit";

var cut = function( story, count ) {
    story.words.itemByRange( count, -1).remove();
};

if (app.documents.length === 0 ||
    app.selection.length === 0 ||
    app.selection[0].constructor.name !== "InsertionPoint" ||
    app.selection[0].parentStory.length !== 0) {
        alert( "Put the cursor in an empty text box and start again." );
        exit();
}
   
var wordCount = prompt ("Word count?", ""); 

if (wordCount === null) {
    exit();
}

var sel = app.selection[0];
sel.place( COPYFIT_TEXT_FILE_PATH );
cut( sel.parentStory, parseInt( wordCount ));

