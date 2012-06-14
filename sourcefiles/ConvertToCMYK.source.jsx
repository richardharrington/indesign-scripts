// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


/*

Take a picture selected in InDesign, open it in Photoshop,
convert to CMYK and save under a new name, then replace
the original picture with the new one in InDesign. 

*/

#targetengine convertToCMYK

#include utilities/util.jsx

var util = FORWARD.Util;

var targetApp,
    returnCounter = 0,
    imagesToBeProcessed = [],
    imageNames = {
        succeeded: {
            array: [],
            reportMessage: "The following images were converted successfully to CMYK:"
        },
        alreadyCMYK: {
            array: [],
            reportMessage: "The following images were NOT converted because they were already CMYK:"
        },
        linkIsBroken: {
            array: [],
            reportMessage: "The following images were NOT converted because their links were broken:"
        },
        failedInPhotoshop: {
            array: [],
            reportMessage: "The following images were NOT converted because Photoshop suffered an error while trying to convert them:"
        }
    };

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

// Makes the report after all the callbacks have returned.
// Does a generic success message if there were no broken links or errors in Photoshop
// (meaning there were only successful conversions and files that were ignored
// because they were already CMYK.)
report = function() {
    var result, str;
    if ((imageNames.linkIsBroken.array.length === 0) && (imageNames.failedInPhotoshop.array.length === 0)) {
        str = "All selected images that were not already CMYK were successfully converted to CMYK.";
    } else {
        str = "ConvertToCMYK report:"; 
        for (var k in imageNames) {
            result = imageNames[k];
            if (result.array.length > 0) {
                str += "\n\n" + result.reportMessage + "\n\n";
                util.forEach(result.array, function( name ) {
                    str += name + "\n";
                });            
            }
        }
    }
    alert(str);
};

// callbacks created by these next two functions either import converted images into InDesign or log unsuccessful attempts.
// The also log the successful ones in case we have to make an error report
// (We don't actually make a report if everything was successful, but if there were any 
// problems, we want to have a list of both the good and the bad, so we can say, "these images failed, but on
// the bright side, these other images succeeded.")
createCallback = function( img ) {
    return function( resultObj ) {
        imageNames.succeeded.array.push( img.itemLink.name );
        var path = resultObj.body;
        img.place( path );
        returnCounter += 1;
        if (returnCounter === imagesToBeProcessed.length) report();
    };
};

createErrorHandler = function( img ) { 
    return function( errorObj ) {
        imageNames.failedInPhotoshop.array.push( img.itemLink.name );
        returnCounter += 1;
        if (returnCounter === imagesToBeProcessed.length) report();
    };
};

// -------------------------------------------------------

targetApp = BridgeTalk.getSpecifier( "photoshop" );
if (!targetApp || !BridgeTalk.isRunning( targetApp )) {
    util.errorExit( 'Please start Photoshop and then try again.' );
}

// Extract images from the selection collection, leaving non-image items behind. 
// First check for images, then check for image containers, making sure to skip 
// empty image containers.

// Finally, assign all the images to different arrays: linkIsBroken, alreadyCMYK, and toBeProcessed.
// Note that the broken-link check has higher priority than the already-CMYK check.

// This search digs down into groups and image containers only at the top level, by invoking the processItem
// function on all the page items returned by the allPageItems property of each group or image container. This
// property will return groups and image containers too, in addition to their contents, so we don't want to 
// use a traditional recursive pattern, because it will get everything multiple times.

var processItem = function( item ) {
    var img;
    if (item.constructor.name === "Image") {
        img = item;
        if (img.itemLink.status === LinkStatus.LINK_MISSING) {
            imageNames.linkIsBroken.array.push( img.itemLink.name );
        } else if (img.space === 'CMYK') {
            imageNames.alreadyCMYK.array.push( img.itemLink.name );
        } else {
            imagesToBeProcessed.push( img );
        }
    }
};

util.forEach( app.selection, function ( sel ) {
    if (util.isIn( sel.constructor.name, ["Group", "Rectangle", "Oval", "Polygon"] ) && sel.allPageItems) {
        util.forEach( sel.allPageItems, processItem );
    } else {
        processItem( sel );
    }
});

// What to do if there's no images to be processed:
// 1) If there's nothing else to report at all, just exit.
// 2) If there are other things to report (like broken links or files already CMYK),
// then run the report function.
if (imagesToBeProcessed.length === 0) {
    if ((imageNames.linkIsBroken.array.length === 0) &&
        (imageNames.alreadyCMYK.array.length === 0)) {
            util.errorExit( "Please select at least one image or image box and try again." );
    } else {
        report();
    }
}
    
// Error-handling finished. Now actually do the thing.
// (It won't happen if the array is empty).
util.forEach( imagesToBeProcessed, function( img ) {
    var callback = createCallback( img );
    var errorHandler = createErrorHandler( img );
    var imageFilePath = img.itemLink.filePath;
    convertFile( targetApp, psConvertToCMYK, imageFilePath, callback, errorHandler );
});


// That's all folks.


