// Begin script to do application submittal actions. Runs the WTUA event for Application Acceptance - Awaiting Owner Submittals
include("DO_APPLICATION_SUBMITTED_ACTIONS");
// End script to do application submittal actions. Runs the WTUA event for Application Acceptance - Awaiting Owner Submittals

// Begin script to actiave the Initial Review Task
include("ACTIVATE_INITIAL_REVIEW");
// End script to actiave the Initial Review Task

if (wfStatus.equals("Additional Info Requested")){
	// Begin Story 293, 1370
	include("SEND_INCOMPLETE_APPLICATION_NOTICE");
	// End Story 293, 1370
}

//if (wfStatus.equals("Temporarily Approved")){
if (wfStatus.equals("Temporarily Approved") || wfStatus.equals("Temp License Granted") || wfStatus.equals("Temp License Granted with Issues")) {
	// Begin Story 1557
	include("SEND_TEMP_LICENSE_INCOMPLETE_NOTICE");
	//End Story 1557
}

// Begin script to send denial email
if (wfStatus.equals("Denied")){
	// Begin Story 181
	include("SEND_DENIED_NOTICE");
	// End Story 181
}
// End script to send denial email

// Begin script to send temporary denial notice - Story 1804
include("SEND_TEMP_DENIED_NOTICE");
// End script to send temporary denial notice

// Begin script #45: Appeal Process Activation 
include("SEND_WAIT_FOR_APPEAL");
include("SEND_TEMP_WAIT_FOR_APPEAL");
// End script #45: Appeal Process Activation 

if (wfTask.equals("Issuance") && wfStatus.equals("Waiting for Payment")) {
	// Begin Story 323
	include("SEND_FEES_DUE_NOTICE");
	// End Story 323
} else if (wfTask.equals("Issuance")) {
	// Begin Story 298
	include("SEND_NEW_INFO_NOTICE");
	// End Story 298
}

if (wfTask.equals("Wait for Appeal") && wfStatus.equals("Waiting for Payment")) {
	// Begin Story 323
	include("SEND_APPEAL_FEES_DUE");
	// End Story 323
}
if (wfTask.equals("Application Acceptance") && wfStatus.equals("Application Received")) {
	// Begin Story 5135, 6083
	include("CREATE_DOCUMENT_CONDITIONS");
	// End Story 5135, 6083
}

//Begin script to send email to all owners in the Owner table - commented out 5/18/20 per Aaron email
//include("SEND_OWNER_EMAILS");
//End script to send email to all owners in the Owner table

// Begin script to set 'Awaiting Review'. Runs the WTUA event for Initial Review - Awaiting Review
include('AWAITING_REVIEW');
// End script to set 'Awaiting Review'.

//Start - License Creation/Update Script
include("CREATE_LICENSE_RECORD");
//End - License Creation/Update Script

//Begin email to all contacts when application is submitted in back office. Email is to let them know the application number and fee amount due, User Story 1625
include("SEND_APP_FEE_ACKNOWLEDGEMENT");
//End email to all contacts when application is submitted in back office. Email is to let them know the application number and fee amount due, User Story 1625

//Begin conditional branch for denied denials
if (wfTask.equals("Executive Review") && wfStatus.equals("Return to Review")){
	include("ACTIVATE_DENIED_TASK");
}
//End conditional branch for denied denials

//Begin set application status to "Pending Final Review" when all parallel reviews are complete
include("UPDATE_APP_SUPERVISOR_REVIEWS_COMPLETE");
//End set application status to "Pending Final Review" when all parallel reviews are complete

//Begin conditional branch for sending abandoned notice
if (wfTask.equals("Close Out") && wfStatus.equals("Abandoned")){
	include("NOTIFY_ABANDONED_APP");
}
//End conditional branch for sending abandoned notice

// Begin schedule meeting for Review - script #48
if (wfTask.equals("DCR Community Meeting") && wfStatus.equals("Recommend Approval")) {
	        // get 20 business days after
	        todayDateJS = new Date();
	        meetingDate = workDaysAdd(todayDateJS, 20, ['AGENCY WORKDAY'], ["WEEKEND", "HOLIDAY"]);
	        schResult = scheduleMeeting(meetingDate, "CANNABIS COMMISSION MEETING", 60, 90, capId);
}
// End schedule meeting for Review

// Begin schedule meeting for Appeal - Script #44
if (wfTask.equals("Appeal Meeting") && wfStatus.equals("CRC Meeting Scheduled")) {
	    dateNotsMailed = getStatusDateinTaskHistory("Appeal Meeting", "Public Notifications Mailed");
	    if (dateNotsMailed) {
	        // get 20 business days after
	        dateNotsMailedJS = new Date(dateNotsMailed.getTime());
	        meetingDate = workDaysAdd(dateNotsMailedJS, 20, ['AGENCY WORKDAY'], ["WEEKEND", "HOLIDAY"]);
	        schResult = scheduleMeeting(meetingDate, "CANNABIS COMMISSION MEETING", 60, 90, capId);
	    } else {
	        logDebug("Warning: No Public Notifications Mailed status set, CRC Meeting not scheduled");
	    }
}
// End schedule meeting for Appeal

//Start send reviewer notice if returned from supervisor
include("SEND_REVIEWER_NOTICE");
//End send reviewer notice
