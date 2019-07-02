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

// Assess fees
if (AInfo["Is this a Renewal?"] && AInfo["Is this a Renewal?"].substr(0, 1).toUpperCase().equals("Y")) {
	// skip fees
} else {
	include("ASSESS_BUS_APP_FEES");
}
// end assess fees
