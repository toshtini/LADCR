// Begin associated forms for owner data
//
// EWYLAM -- turned off associated forms on the record, so I disabled this script (JHS)
//include("DO_ASSOCIATED_FORM_OWNER_SUB");
// End associated forms for owner data

// Begin script to copy Business contact information (Business Name and Address) to record
include("SAVE_BUSINESS_INFO_TO_RECORD");
// End script to copy Business contact information (Business Name and Address) to record

// Check matching FEIN or SSN for this BTRC, not for testing records
if (!appMatch("Licenses/Cannabis/Testing/Application")) {
	include("CHECK_SSN_FEIN_MATCH");
}
// end check for fein/ssn

// Assess fees - commented out for temp renewal processing 3/24/2020
//if (AInfo["Is this a Renewal?"] && AInfo["Is this a Renewal?"].substr(0, 1).toUpperCase().equals("Y")) {
//	include("ASSESS_BUS_REN_FEES");
//} else {
//	include("ASSESS_BUS_APP_FEES2");
//}
// end assess fees

// Begin script to update the Application AltID based on Business Activity
//if(!publicUser && appMatch("Licenses/Cannabis/Business/Application")){
//	include("UPDATE_APPLICATION_MJ_ALTID");
//}
// End script to update the Application AltID based on Business Activity

//Start Core Renewal Functionality 03/25/2020
if (parentCapId == "undefined" || parentCapId == null) {
	parentCapId = aa.env.getValue("ParentCapID");
}

if (parentCapId != null) {
		
	//Copy Parcels from license to renewal
	copyParcels(parentCapId,capId);
	
	//Copy addresses from license to renewal
	copyAddress(parentCapId,capId);
	
	//copy ASI Info from license to renewal
	copyASIInfo(parentCapId,capId);

	//Copy ASIT from license to renewal (exclude Permit Information)
	copyASITables(parentCapId,capId);

	//Copy Contacts from license to renewal
	copyContacts3_0(parentCapId,capId);
	
	//Copy Work Description from license to renewal
	aa.cap.copyCapWorkDesInfo(parentCapId,capId);

	//Copy application name from license to renewal
	editAppName(getAppName(parentCapId),capId);
}
//End Core Renewal Functionality
