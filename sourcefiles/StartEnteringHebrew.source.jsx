// Set to 6.0 scripting object model (Indesign CS4)app.scriptPreferences.version = 6.0;




//DESCRIPTION: create a right-to-left Hebrew character stylevar fontFamilyName = 'Times New Roman';try {startEnteringHebrew (app.activeDocument, fontFamilyName)}catch (_){alert ('Could not start typing Hebrew: ' + _); exit()}function startEnteringHebrew (doc, fontname)    {    var sel = doc.selection[0];    sel.composer = "Adobe World-Ready Paragraph Composer";       if (typeof sel.contents != 'string') throw ("You've got no text selected.");   if (sel.length != 0) alert ("You've got stuff selected.  Make sure it's Hebrew, otherwise it will be English text converted to Times New Roman font.  Plus it will be backwards.");      sel.appliedFont = fontname;   //ps.composer = "Adobe World-Ready Single-line Composer";    sel.characterDirection = CharacterDirectionOptions.rightToLeftDirection;    }