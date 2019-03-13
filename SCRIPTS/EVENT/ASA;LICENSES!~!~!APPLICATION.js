include("SAVE_BUSINESS_INFO_TO_RECORD");	
// End script to copy Business contact information (Business Name and Address) to record	// End script to copy Business contact information (Business Name and Address) to record


 // Check matching FEIN or SSN for this BTRC, not for testing records	
if (!appMatch("Licenses/Cannabis/Testing/Application")) {	
	include("CHECK_SSN_FEIN_MATCH");	
	}	
// end check for fein/ssn	

 // Assess fees	// Assess fees
include("ASSESS_BUS_APP_FEES");	
// end assess fees
