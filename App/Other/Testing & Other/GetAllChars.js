//WScript stuff

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




//Utilities

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}




//Actual Script

var output = ""
var valid = [];

var i = 33
for (; i <= 99159; i++) {
	var chr = String.fromCharCode(i);
	//if (!valid.contains(chr)) {
	//	valid.push(chr);
	//	output += chr;
	//}
	var safe = true;
	//try {
		WScript.Echo(i + ", " + chr);
	//} catch (e) {
	if (WScript.Err.Number !== 0) {
		safe = false;
		WScript.Sleep(5000);
	}
	//}
	if (safe) {
		output += chr;
	}
}

WScript.Echo("A");
WScript.Echo(output);
//WriteFile("C:/Users/Alex - School/Documents/2016/Semester 1/C&C Ideation Studio/App/ProjectWriteWebsite0.1/Other/Testing & Other/output.txt", output);
var f_ = fso.OpenTextFile("C:/Users/Alex - School/Documents/2016/Semester 1/C&C Ideation Studio/App/ProjectWriteWebsite0.1/Other/Testing & Other/output.txt", fsoForWriting);
f_.Write("\"" + output + "\"");
f_.Close();

