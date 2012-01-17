// TO BE ADDED TO THE LIBRARY.

Hyperlink.prototype.changeDestination = function( props, sharedDest ) {

  var doc = this.parent;

  var dest = this.destination;
  var destURL = dest.destinationURL;
  var destName = dest.name;

  // Check to see if we want an unshared destination, and also if 
  // we already have an unshared destination, before removing the 
  // old destination and replacing it with a new one.

  if (!sharedDest && !dest.hidden) {
    dest.remove();
    dest = doc.hyperlinkURLDestinations.add( 
            destURL, {name: destName || Math.random().toString(), hidden: !sharedDest} );
    this.destination = dest;
  }

  this.properties = props;  
};


// -------- TEST (need to have an existing hyperlink called existingHyperlink)------------

var DEFAULT_HYPERLINK_PROPERTIES = {
  borderColor: [183, 27, 23],  // Burgundy, roughly.
  borderStyle: HyperlinkAppearanceStyle.DASHED,
  width: HyperlinkAppearanceWidth.THIN,
  visible: true,
};

var existingHyperlink = app.activeDocument.hyperlinks[0];

existingHyperlink.changeDestination( DEFAULT_HYPERLINK_PROPERTIES, false );




/* With error checking, but without changing of properties.

Hyperlink.prototype.changeDestinationSharing = function( shared ) {

  var newDestHidden = !shared;  
  var doc = this.parent;

  var dest = this.destination;
  if (!dest) {
	  throw new Error("This hyperlink is missing its destination.");
  }

  var destURL = dest.destinationURL;
  var destName = dest.name;
  var destHidden = dest.hidden;

  // If the shared status of the existing destination does not
  // match what we want, remove the old one and replace it with a new one.

  if (destHidden !== newDestHidden) {
	  dest.remove();
    dest = doc.hyperlinkURLDestinations.add( 
            destURL, {name: destName || Math.random().toString(), hidden: newDestHidden} );
    this.destination = dest;
  }
};

// -------- TEST (need to have a hyperlink called existingHyperlink)------------

var existingHyperlink = app.activeDocument.hyperlinks[0];

try {
  existingHyperlink.changeDestinationSharing( true );
} catch(e) {
  alert(e.message);
}

*/