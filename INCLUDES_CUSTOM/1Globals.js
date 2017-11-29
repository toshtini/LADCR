// DEV environment
var ENVIRON = "DEV";
var EMAILREPLIES = "noreply@accela.com";
var SENDEMAILS = false;
var ACAURL = "https://aca.supp.accela.com/BMCR";


//set Debug
var vDebugUsers = ['JSCHOMP','EWYLAM','ADMIN','JSCHILLO'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}