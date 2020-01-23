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
	include("UPDATE_APPLICATION_MJ_ALTID");
}
// End script to update the Application AltID based on Business Activity

// Begin script to update the Application field Social Equity Applicants Reference Contact ID with the public users refcontactno
if(publicUser && appMatch("Licenses/Cannabis/Business/Application")){
	include("ACA_SAVE_PUBLICUSER_REFCONTACT_REFNO_TO_APP");
}

// script 60, 8/29/2019, per Jason, invoice not ready to distribute. Commenting out code.
//if(AInfo["Retailer Commercial Cannabis Activity license in an area of Undue Concentration?"] == "Yes"){
//	include("SEND_INVOICE");
//}

// End script
