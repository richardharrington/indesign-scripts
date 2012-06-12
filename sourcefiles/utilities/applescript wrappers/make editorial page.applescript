#!/usr/bin/osascript

set aScriptPath to "/Volumes/English/PRODUCTION FILES/MASTER FOLDER/indesign scripts/MakeEditorialPage.jsx"
tell application "Adobe InDesign CS5"
  do script aScriptPath language javascript
end tell