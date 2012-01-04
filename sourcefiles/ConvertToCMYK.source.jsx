/*

- open Photoshop.

- in Photoshop: 

- open file.

- change to cmyk.

- save as psd with the string ' cmyk.psd' inserted in place of the old file extension
	
- open Indesign.

- import the new file.
*/

#include util.jsx

var util = FORWARD.Util;

var ACCEPTED_FILE_EXTENSIONS = ['tif', 'tiff', 'jpg', 'jpeg', 'png', 'gif', 'psd'];

var sel, 
    image, 
    imageFilePath,
    newImageFilePath,
    fileExt;

var importNewCMYKFile,
    psConvertToCMYK,
    convertInPhotoshop,
    createEventHandler;
    
createImagePlacingEventHandler = function( img, path ) {
    return function() {
        img.place( path );
    }
};

psConvertToCMYK = function( filePath, newFilePath ) {
    var doc = app.open( File( filePath ));
    
    doc.changeMode( ChangeMode.CMYK );
    doc.saveAs( File( newFilePath ));
    doc.close( SaveOptions.DONOTSAVECHANGES );
} 

convertInPhotoshop = function( conversion, onReturn, myFilePath, myNewFilePath ) {
  var bt = new BridgeTalk();
  bt.target = "photoshop";
  bt.body = conversion.toSource() + "(" + myFilePath.toSource() + "," + myNewFilePath.toSource() + ")";
  bt.onResult = onReturn;
  bt.send( 30 );
};

if (!util.selectionIs( "Image", "Rectangle") ) {
    util.errorExit( "Please select an image and try again." );
}

sel = app.selection[0];
image = (util.selectionIs( "Image" )) ? sel : sel.images[0];

imageFilePath = image.itemLink.filePath;
fileExt = imageFilePath.substring( imageFilePath.lastIndexOf( '.' )).slice( 1 );

if (!util.isIn( fileExt, ACCEPTED_FILE_EXTENSIONS )) {
    util.errorExit( "This doesn't look like an image file to me. Maybe the file extension is wrong. Please do this conversion manually." );
}

newImageFilePath = imageFilePath.slice( 0, imageFilePath.lastIndexOf( '.' )) + ' cmyk.psd';
importNewCMYKFile = createImagePlacingEventHandler( image, newImageFilePath );

convertInPhotoshop( psConvertToCMYK, importNewCMYKFile, imageFilePath, newImageFilePath );

$.writeln("imageFilePath: " + imageFilePath + "\nfileExt: " + fileExt + "\nnewImageFilePath: " + newImageFilePath + "\n");




// That's all folks.



