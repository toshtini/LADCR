/*------------------------------------------------------------------------------------------------------/
| $Id:  CAN OWN APP App ID.js   2017-05-11   john.schomp $
|
| Usage   : Expression Builder Script that will validate a Cap ID
|
| Client  : BMCR
| Action# : Task 6114
|
| Notes   : Expression builder script to be used on ASI portlet.  Execute on the CAP ID field
|
/------------------------------------------------------------------------------------------------------*/

var msg = "";
var aa = expression.getScriptRoot();

var licCap = null;

var licObj = expression.getValue("ASI::PARENT APPLICATION ID::Application ID");
var thisForm = expression.getValue("ASI::FORM");
var licNum = licObj.value;

if (licNum)
	licCap = aa.cap.getCapID(licNum).getOutput();

if (!licCap) {
	msg = "Invalid License Application, please try again";
	thisForm.blockSubmit = true;
} else {
	if (!appMatch("Licenses/*/*/Application", licCap)) {
		msg = "Invalid License Application, please try again";
		thisForm.blockSubmit = true;
	} else {
		msg = "Application ID Verified, Type: " + aa.cap.getCap(licCap).getOutput().getCapType().getAlias();
		thisForm.blockSubmit = false;
	}
}

licObj.message = msg;
expression.setReturn(licObj);
expression.setReturn(thisForm);

function appMatch(ats, matchCapId) // optional capId or CapID string
{
	if (!matchCapId) {
		return false;
	}

	matchCap = aa.cap.getCap(matchCapId).getOutput();
	matchArray = matchCap.getCapType().toString().split("/");

	var isMatch = true;
	var ata = ats.split("/");
	for (xx in ata)
		if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
			isMatch = false;

	return isMatch;
}
