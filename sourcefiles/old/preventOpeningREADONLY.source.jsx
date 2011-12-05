#targetengine "session"main();function main() {//	var myApplicationEventListener = app.eventListeners.add("afterOpen", myEventInfo);	var myEventListener = app.activeDocument.addEventListener ("afterOpen", myCheckReadOnlyEvent);
//	app.removeEventListener("afterOpen", myEventListener);
	}

function myCheckReadOnlyEvent (myEvent) {	var myString = "Current Target: " + myEvent.currentTarget.name + "\r\r";
	
	myString += app.activeDocument.name +"\r\r";
	
  myString += "DANGER WILL ROBINSON!\r" +
                 "DANGER WILL ROBINSON!\r\r" +
                 "Someone else has this document open. You're opening a read-only copy, so don't make any changes that you don't want to lose.";	alert(myString);}



