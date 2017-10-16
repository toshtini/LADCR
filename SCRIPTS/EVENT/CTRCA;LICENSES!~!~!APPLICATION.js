// Insert the public user reference contact as the owner applicant
include("COPY_PUBLIC_USER_TO_OWNER_APPLICANT");

// Save the Owner Application contact to the Owners ASIT
include("SAVE_OWNER_APPLICANT_TO_OWNER_TABLE");

// Begin script to copy Business contact information (Business Name and Address) to record
include("SAVE_BUSINESS_INFO_TO_RECORD");
// End script to copy Business contact information (Business Name and Address) to record

// Begin functionality to set initial workflow status. This is needed for the initial status to actually exists in the WF History
// Runs the WTUA event for the initial status.
if (publicUser) {
	setInitialWorkflowTaskStatus("Y");
}
// End functionality to set inital workflow status.