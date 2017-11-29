// this is PROD
var ENVIRON = "PROD";
var EMAILREPLIES = "noreply@accela.com";
var SENDEMAILS = true;
var ACAURL = "https://aca.accela.com/LADCR";


//set Debug
var vDebugUsers = ['JSCHOMP','EWYLAM','ADMIN','JSCHILLO'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}