// This bit of code is a temporary thing. It will be added to all the places
// where we process existing hyperlinks, so that they conform to our style.

// REFACTORING NOTE: YOU TEST FOR SOURCES AND DESTINATIONS IN SOME PART OF THIS SCRIPT 
// AND NOT IN OTHERS. THERE'S A VERSION BELOW, COMMENTED OUT, IN WHICH NO VALIDATION
// OF THESE PROPERTIES IS DONE AT ALL. USE THAT ONE AS A MODEL TO ADD TESTS IN ALL CASES.

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




/* 

Hyperlink.prototype.recreate = function( props, sharedDest ) {

  var src, dest, name, destHidden, destName, srcText, destURL, link;
  var doc = this.parent;

  // Save important info

  src = this.source;
  dest = this.destination;
  name = this.name;
 
  srcText = src.sourceText;

  destURL = dest.destinationURL;
  destHidden = dest.hidden;
  destName = dest.name;

  // Remove old hyperlink

  this.remove();
  src.remove();

  // if the destination was hidden, removing the hyperlink will remove the destination
  // and if you try to remove it again an error will be thrown, so check to see if it's hidden before removing it.

  if (!destHidden) dest.remove();

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

*/