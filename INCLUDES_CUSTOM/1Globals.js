// this is a test
var ENVIRON = "TEST";
var EMAILREPLIES = "noreply@accela.com";
var SENDEMAILS = true;
var ACAURL = "https://aca.test.accela.com/LADCR";


//set Debug
var vDebugUsers = ['JSCHOMP','EWYLAM','ADMIN','JSCHILLO'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}