<<<<<<< HEAD
// this is a test
var ENVIRON = "TEST";
var EMAILREPLIES = "noreply@accela.com";
var SENDEMAILS = true;
var ACAURL = "https://aca.test.accela.com/LADCR";
=======
// setting globals per EMSE_ENVIRONMENT standard choice
>>>>>>> Dev

var ENVIRON = lookup("EMSE_ENVIRONMENT","ENVIRON");
var EMAILREPLIES = lookup("EMSE_ENVIRONMENT","EMAILREPLIES");
var SENDEMAILS = lookup("EMSE_ENVIRONMENT","SENDEMAILS").toUpperCase().equals("TRUE");
var ACAURL = lookup("EMSE_ENVIRONMENT","ACAURL");
var SLACKURL = lookup("EMSE_ENVIRONMENT","SLACKURL");
var DEBUGUSERS = lookup("EMSE_ENVIRONMENT","DEBUGUSERS");

//set Debug
<<<<<<< HEAD
var vDebugUsers = ['JSCHOMP','EWYLAM','ADMIN','JSCHILLO'];
=======
var vDebugUsers = DEBUGUSERS.split(",");
>>>>>>> Dev
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}