/*

Take a picture selected in InDesign, open it in Photoshop,
convert to CMYK and save under a new name, then replace
the original picture with the new one in InDesign. 

*/

#targetengine convertToCMYK

#include utilities/util.jsx

var util = FORWARD.Util;

var ACCEPTED_FILE_EXTENSIONS = ['tif', 'tiff', 'jpg', 'jpeg', 'png', 'gif', 'psd'];

var sel, 
    targetApp,
    image, 
    imageFilePath, 
    newImageFilePath,
    fileExt;

var psConvertToCMYK,
    convertInPhotoshop,
    callback,
    errorHandler;

psConvertToCMYK = function( filePath ) {
    
    var addCMYKToName = function( name ) {
        return name.slice( 0, name.lastIndexOf( '.' )) + ' cmyk.psd';
    };
    var doc = app.open( File( filePath ));
    var newFilePath = addCMYKToName( filePath );
    var newFile = File( newFilePath );
    
    /* Add another " cmyk" to the name if there's one already there. */
    if (newFile.exists) {
        newFilePath = addCMYKToName( newFilePath );
        newFile = File( newFilePath );
    }
    
    doc.changeMode( ChangeMode.CMYK );
    doc.saveAs( newFile );
    doc.close( SaveOptions.DONOTSAVECHANGES );
    
    return newFilePath;
};

convertFile = function( appSpecifier, conversion, filePath, success, failure ) {
    var bt = new BridgeTalk();
    bt.target = appSpecifier;
    bt.body = conversion.toSource() + "(" + filePath.toSource() + ");";
    bt.onResult = success;
    bt.onError = failure;
    bt.send();
};

targetApp = BridgeTalk.getSpecifier( "photoshop");
if (!targetApp || !BridgeTalk.isRunning( targetApp )) {
    util.errorExit( 'Please start Photoshop and then try again.' );
}

if (app.selection.length < 1) util.errorExit( "Please select something and try again." );
if (app.selection.length > 1) util.errorExit( "Please select only one thing and try again." );
if (!util.selectionIs( "Image", "Rectangle", "Oval", "Polygon" ) ) util.errorExit( "Please select an image and try again." );

// If the selection is a Rectangle, set variable 'image' to its image, unless
// it's empty and has no image, in which case abort.
sel = app.selection[0];
if (util.selectionIs( "Image" )) {
    image = sel;
} else { // selection is a Rectangle, Oval or Polygon
    if (sel.images.length === 0) {
        util.errorExit( "Please select a non-empty image and try again." );
    } else {
        image = sel.images[0];
    }
}

if (image.itemLink.status === LinkStatus.LINK_MISSING) {
    util.errorExit( "Link missing. Please relink this image and try again." );
}

imageFilePath = image.itemLink.filePath;
fileExt = imageFilePath.substring( imageFilePath.lastIndexOf( '.' )).slice( 1 );

// Check file extensions ('false' means a case-insensitive check)
if (!util.isIn( fileExt, ACCEPTED_FILE_EXTENSIONS, false )) {
    util.errorExit( "This doesn't look like an image file to me. Maybe the file extension is wrong. Please do this conversion manually." );
}

// callback imports the converted image into InDesign.

callback = (function( img ) {
    return function( resultObj ) {
        var path = resultObj.body;
        img.place( path );        
    };
})( image );

errorHandler = (function( img ) { // might need to pass the img some day; don't need it now.
    return function( errorObj ) {
        alert("Photoshop suffered a grievous error attempting to process the following file:\n" + img.itemLink.name);
    };
})( image );

convertFile( targetApp, psConvertToCMYK, imageFilePath, callback, errorHandler );



// That's all folks.


