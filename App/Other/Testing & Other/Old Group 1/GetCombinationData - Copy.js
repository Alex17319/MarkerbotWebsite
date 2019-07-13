var WshShell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var fsoForReading = 1;
var fsoForWriting = 2;

function ReadFile(filename) {
	var f = fso.OpenTextFile(filename, fsoForReading);
	var toReturn = f.ReadAll();
	f.Close();
	return toReturn;
}

function WriteFile(filename, text) {
	var f = fso.OpenTextFile(filename, fsoForWriting);
	f.Write(text);
	f.Close();
}

var pasteAreaPath = '"C:/Users/Alex - School/Documents/2016/Semester 1/C&C Ideation Studio/App/ProjectWriteWebsite0.1/Testing & Other/PasteArea.txt"';
var outputPath = '"C:/Users/Alex - School/Documents/2016/Semester 1/C&C Ideation Studio/App/ProjectWriteWebsite0.1/Testing & Other/Output.txt"';

var startingLetters = "a,b,c,g,i,k,l,o,p,q,r,s,t,tt,v,x,z";
var endingLetters = "a,b,e,i,l,m,o,p,r,s,t,u,v,x,z";
//var combinationData = [];
var combinationDataText = "";

var startLetters = startingLetters.split(",");
var endLetters = endingLetters.split(",");

for (var i = 0; i < startLetters.length; i++) {
	for (var j = 0; j < endLetters.length; j++) {
		                     //Start Chrome
		WScript.sleep(1000); WshShell.Run('cmd /C "C:/Users/Alex/Documents/Programs/Chrome Portable/Google Chrome Portable 1/GoogleChromePortable.exe" & PAUSE');
		                     WScript.sleep(5000);
		WScript.sleep(1000); WshShell.AppActivate("New Tab - Google Chrome");
		                     //Navigate (and enter combination)
		WScript.sleep(1000); WshShell.SendKeys("view-source:http://www.wordfind.com/contains/");
		WScript.sleep(1000); WshShell.SendKeys(startLetters[i] + endLetters[i]);
		WScript.sleep(1000); WshShell.SendKeys("/{ENTER}");
		                     WScript.sleep(10000);
		                     //Select and copy
		WScript.sleep(1000); WshShell.SendKeys("^A");
		WScript.sleep(1000); WshShell.SendKeys("^C");
		                     //Close Chrome
		WScript.sleep(1000); WshShell.SendKeys("%{F4}");
		
		                     //Open PasteArea.txt
		WScript.sleep(1000); WshShell.Run('notepad.exe ' + pasteAreaPath);
		                     WScript.sleep(5000);
		WScript.sleep(1000); WshShell.AppActivate("PasteArea.txt - Notepad");
		                     //Clear file
		WScript.sleep(1000); WshShell.SendKeys("^A");
		WScript.sleep(1000); WshShell.SendKeys("{BS}");
		                     //Paste
		WScript.sleep(1000); WshShell.SendKeys("^V");
		WScript.sleep(1000); WshShell.SendKeys("^S");
		                     //Close PasteArea.txt
		WScript.sleep(1000); WshShell.SendKeys("%{F4}");
		
		                     //Get pasted data
		WScript.sleep(1000); pageSource = ReadFile(pasteAreaPath);
		
		                     //Do stuff with data
		                     //combinationData.push({combination: startLetters[i] + endLetters[i], length: pageSource.length});
		WScript.sleep(1000); combinationDataText += "(" + startLetters[i] + endLetters[i] + ", " + pageSource.length + "), \n";
	}
}

WScript.sleep(3000);

WriteFile(outputPath, combinationDataText);
try { //I cant be bothered testing or researching
	WScript.MsgBox(combinationDataText)
} catch (e) {
	alert(combinationDataText);
}