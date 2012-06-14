#targetengine "MyStartupItems"

// Set to 7.0 scripting object model (Indesign CS5)
app.scriptPreferences.version = 7.0;


app.doScript (File (app.activeScript.parent + "/AddMenuItems.source.jsx"));

