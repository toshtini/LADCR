// Insert the public user reference contact as the owner applicant
//include("COPY_PUBLIC_USER_TO_OWNER_APPLICANT");
// Insert the public user reference contact as the owner applicant or agent of service (ghess, 3/20/18)
if (AInfo["Agent of Service"] == "Yes") {
	include("COPY_PUBLIC_USER_TO_AGENT_OF_SERVICE");
} else {
	include("COPY_PUBLIC_USER_TO_OWNER_APPLICANT");
}

// Begin script to set the Owner Applicant information in the Owners ASIT to Read Only.
include("SET_OWNER_APPLICANT_OWNER_TABLE_READ_ONLY");
// End script to set the Owner Applicant information in the Owners ASIT to Read Only.

// Begin script to copy Business contact information (Business Name and Address) to record
include("SAVE_BUSINESS_INFO_TO_RECORD");
// End script to copy Business contact information (Business Name and Address) to record

//Begin script to invoice all fees and set workflow task Application Acceptance to Waiting for Payment when user Defers Payment in ACA
include("WAITING_FOR_PAYMENT");
//End script to invoice all fees and set workflow task Application Acceptance to Waiting for Payment when user Defers Payment in ACA

// Begin functionality to set initial workflow status. This is needed for the initial status to actually exists in the WF History
// Runs the WTUA event for the initial status.
if (publicUser) {
	setInitialWorkflowTaskStatus("Y");
}
// End functionality to set inital workflow status.

// Begin script to update the Application AltID based on Business Activity
if(publicUser && appMatch("Licenses/Cannabis/Business/Application")){
	//include("UPDATE_APPLICATION_MJ_ALTID");
	//
	var thisActivityType = null
	if(getAppSpecific("Retailer Commercial Cannabis Activity license in an area of Undue Concentration?") == "Yes")
		{
		var thisRecType = "PCN"
		}
	else
		{
		var thisRecType = "NONPCN"
		}

	/* C – Cultivation (any and all)
	Adult-Use Cultivation Small Indoor,Adult-Use Cultivation Medium Indoor,Adult-Use Cultivation Specialty Indoor,Medical Cultivation Small Indoor,Medical Cultivation Medium Indoor,Medical Cultivation Specialty Indoor
	*/
	var ACSI = getAppSpecific("Adult-Use Cultivation Small Indoor");
	var ACMI = getAppSpecific("Adult-Use Cultivation Medium Indoor");
	var ACSPI = getAppSpecific("Adult-Use Cultivation Specialty Indoor");
	var MCSI = getAppSpecific("Medical Cultivation Small Indoor");
	var MCMI = getAppSpecific("Medical Cultivation Medium Indoor");
	var MCSPI = getAppSpecific("Medical Cultivation Specialty Indoor");
	if(ACSI == "CHECKED" ||  ACMI  == "CHECKED" && ACSPI == "CHECKED" || MCSI == "CHECKED" || MCMI == "CHECKED" || MCSPI == "CHECKED")
		{
		thisActivityType = "C"
		}
	/*V – Manufacture Level 2 (volatile)
	Adult-Use Manufacturer Level 2,Medical Manufacturer Level 2
	*/
	var AML2 = getAppSpecific("Adult-Use Manufacturer Level 2");
	var MML2 = getAppSpecific("Medical Manufacturer Level 2");
	if(AML2  == "CHECKED" || MML2  == "CHECKED")
		{
		thisActivityType = "V"
		}
	/* D – Distribution Transport Only
	Distributor Transport Only,Medical Distributor Transport Only,Adult-Use Distributor Transport Only 
	*/
	var DTO = getAppSpecific("Distribution Transport Only");
	var ADTO = getAppSpecific("Adult-Use Distributor Transport Only");
	var MDTO = getAppSpecific("Medical Distributor Transport Only");
	if(DTO  == "Yes" || ADTO  == "CHECKED" || MDTO  == "CHECKED")
		{
		thisActivityType = "D"
		}
	/* R - Retail Adult-Use Retail,Medical Retail
	*/
	var AR = getAppSpecific("Adult-Use Retail");
	var MR = getAppSpecific("Medical Retail");
	if(AR  == "CHECKED" || MR == "CHECKED" )
		{
		thisActivityType = "R"
		}
	/* T - Testing 
	*/
	if(getAppSpecific("Testing")  == "Yes")
		{
		thisActivityType = "T"
		}
	/* O - Other
	Adult-Use Distributor,Medical Distributor,Adult-Use Manufacturer Level 1,Adult-Use Delivery Only,Medical Manufacturer Level 1,Medical Delivery Only,Adult-Use Microbusiness,Medical Microbusiness
	*/
	var AD = getAppSpecific("Adult-Use Distributor");
	var MD = getAppSpecific("Medical Distributor");
	var AML1 = getAppSpecific("Adult-Use Manufacturer Level 1");
	var MML1 = getAppSpecific("Adult-Use Manufacturer Level 1");
	var ADO = getAppSpecific("Adult-Use Delivery Only");
	var AMO = getAppSpecific("Medical Delivery Only");
	var AMB = getAppSpecific("Adult-Use Microbusiness");
	var MMB = getAppSpecific("Medical Microbusiness");
	if(AD == "CHECKED" || MD== "CHECKED" || AML1== "CHECKED" || MML1 == "CHECKED" || ADO== "CHECKED" || AMO== "CHECKED" || AMB== "CHECKED" || MMB== "CHECKED")
		{
		thisActivityType = "O"
		}

	// Update the AltID
	lacdUpdateAltID(capId,thisRecType,capId.getCustomID(), thisActivityType)

	}
// End script to update the Application AltID based on Business Activity

// Begin script to update the Application field Social Equity Applicants Reference Contact ID with the public users refcontactno
if(publicUser && appMatch("Licenses/Cannabis/Business/Application")){
	include("ACA_SAVE_PUBLICUSER_REFCONTACT_REFNO_TO_APP");
}
// End script