//ASSESS_BUS_APP_FEES_2020.09.js
// Uses business activity application drill down selections in ACA
// Last Update 09/04/20
// This relies on AInfo[] being populated with custom fields.

if (!isTrue(AInfo["Is this a Renewal?"])) {
	logDebug("Not a Renewal");
 
	//updateFee("J300","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Pre-Application Review Fee
	updateFee("F100","CAN_BUS_APP","FINAL",1,"Y"); //place holder until fee is created

}

function isTrue(o) {
	return String(o) == "CHECKED" || String(o) == "YES" || String(o) == "Yes";
}
