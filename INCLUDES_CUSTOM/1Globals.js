// setting globals per EMSE_ENVIRONMENT standard choice

var ENVIRON = lookup("EMSE_ENVIRONMENT","ENVIRON");
var EMAILREPLIES = lookup("EMSE_ENVIRONMENT","EMAILREPLIES");
var SENDEMAILS = lookup("EMSE_ENVIRONMENT","SENDEMAILS").toUpperCase().equals("TRUE");
var ACAURL = lookup("EMSE_ENVIRONMENT","ACAURL");
var SLACKURL = lookup("EMSE_ENVIRONMENT","SLACKURL");
var DEBUGUSERS = lookup("EMSE_ENVIRONMENT","DEBUGUSERS");

//set Debug
var vDebugUsers = DEBUGUSERS.split(",");
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}