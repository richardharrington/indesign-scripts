// This bit of code is a temporary thing. It will be added to all the places
// where we process existing hyperlinks, so that they conform to our style.

Hyperlink.prototype.recreate = function( props, /* bool */ sharedDest ) {
  
  var src, dest, name, destHidden, destName, link;
  var doc = this.parent;
  
  // Save important info
  
  var srcText = this.source.sourceText;
  var destURL = this.destination.destinationURL;
  
  src = this.source;
  dest = this.destination;
  name = this.name;
  
  if (dest) {
    destHidden = dest.hidden;
    destName = dest.name;
  }
  
  // Remove old hyperlink
  
  this.remove();
  if (src) src.remove();
  
  // if the destination was hidden, removing the hyperlink will remove the destination
  // and if you try to remove it again an error will be thrown
  
  if (dest && !destHidden) dest.remove();
      
  // Create new hyperlink

  dest = doc.hyperlinkURLDestinations.add( destURL, {name: destName || Math.random().toString(), hidden: !sharedDest} );
  src = doc.hyperlinkTextSources.add ( srcText );

  link = doc.hyperlinks.add( src, dest, props );
  link.name = name || srcText.contents.slice( 0, 20 );
  
  return link;
};


// -------- TEST (need to have an existing hyperlink called existingHyperlink)------------

var DEFAULT_HYPERLINK_PROPERTIES = {
  borderColor: [183, 27, 23],  // Burgundy, roughly.
  borderStyle: HyperlinkAppearanceStyle.DASHED,
  width: HyperlinkAppearanceWidth.THIN,
  visible: true,
};

var newHyperlink = existingHyperlink.recreate( DEFAULT_HYPERLINK_PROPERTIES, false );
