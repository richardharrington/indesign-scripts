/*

Take a picture selected in InDesign, open it in Photoshop,
convert to CMYK and save under a new name, then replace
the original picture with the new one in InDesign. 

*/

#targetengine convertToCMYK

#include utilities/util.jsx

var util = FORWARD.Util;

var targetApp,
    imageArray = [],
    brokenLinkImageArray = [],
    failedInPhotoshop = [];
    returnCounter = 0;
    str;

var psConvertToCMYK,
    convertInPhotoshop,
    createCallback,
    createErrorHandler,
    report;
    
// A function designed to be run in Photoshop. 
// It gets passed to BridgeTalk as a string, using the .toSource() method.
psConvertToCMYK = function( filePath ) {
    
    var addCMYKToName = function( name ) {
        return name.slice( 0, name.lastIndexOf( '.' )) + ' cmyk.psd';
    };
    var doc = app.open( File( filePath ));
    var newFilePath = addCMYKToName( filePath );
    var newFile = File( newFilePath );
    
    /* Add another " cmyk" to the name if there's one already there. 
       Actually, keep checking until the file doesn't exist, in case there's 
       a bunch of cmyk's at the end of the name. */
    while (newFile.exists) {
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

// This function 'report' is run each time a callback returns, but only after the last
// one returns does it actually issue its report.
report = function() {
    returnCounter += 1;
    if (returnCounter === imageArray.length) {
        var str = "Photoshop suffered a grievous error attempting to process the following file(s):\n";
        util.forEach( failedInPhotoshop, function( failedFileName ) {
            str += failedFileName + "\n\n";
        });
        if (failedInPhotoshop.length > 0) alert(str);
    }
};

// callbacks created by createCallback import converted images into InDesign.
createCallback = function( img ) {
    return function( resultObj ) {
        var path = resultObj.body;
        img.place( path );
        report();
    };
};

createErrorHandler = function( img ) { 
    return function( errorObj ) {
        failedInPhotoshop.push( img.itemLink.name );
        report();
    };
};

// -------------------------------------------------------

targetApp = BridgeTalk.getSpecifier( "photoshop" );
if (!targetApp || !BridgeTalk.isRunning( targetApp )) {
    util.errorExit( 'Please start Photoshop and then try again.' );
}

// Extract an array of images from the selection collection, leaving non-image items behind.
// First check for images, then check for image containers (making sure to skip empty image containers).
util.forEach( app.selection, function( sel ) {
    if (sel.constructor.name === "Image") {
        imageArray.push( sel );
    } else if (sel.constructor.name === "Rectangle" && sel.images.length > 0) {
        imageArray.push( sel.images[0] );
    }
});
    
if (imageArray.length === 0) util.errorExit( "Please select at least one image or image box and try again." );
    
// Make sure the links are all intact before proceeding.
util.forEach( imageArray, function( img ) {
    if (img.itemLink.status === LinkStatus.LINK_MISSING) {
        brokenLinkImageArray.push( img );
    }
});

if (brokenLinkImageArray.length > 0) {
    str = "The links to the following images were broken; "
        + "please fix the links or just try again without these "
        + "images as part of your selection: \n";
    
    util.forEach( brokenLinkImageArray, function( img ) {
        str += img.itemLink.name + "\n";
    });
    util.errorExit( str );
}

// Error-handling finished. Now actually do the thing.
util.forEach( imageArray, function( image ) {
    var callback = createCallback( image );
    var errorHandler = createErrorHandler( image );
    var imageFilePath = image.itemLink.filePath;
    convertFile( targetApp, psConvertToCMYK, imageFilePath, callback, errorHandler );
});


// That's all folks.


