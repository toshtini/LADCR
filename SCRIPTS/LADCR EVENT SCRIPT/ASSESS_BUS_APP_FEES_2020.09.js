//ASSESS_BUS_APP_FEES_2020.09.js
// Uses business activity application drill down selections in ACA
// Last Update 09/09/20
// This relies on AInfo[] being populated with custom fields.

if (isTrue(AInfo["Are you submitting a Modification Request?"])) {
	updateFee("J098B21","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Application Review Fee
}

if (!isTrue(AInfo["Is this a Renewal?"])) {
	logDebug("Not a Renewal");
 
	updateFee("J300","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Pre-Application Review Fee

}


function isTrue(o) {
	return String(o) == "CHECKED" || String(o) == "YES" || String(o) == "Yes";
}
