// Begin script to do application submittal actions
if (publicUser && wfTask == "Application Acceptance" && wfStatus == "Submitted") {
	// ACA submittal, set to Awaiting Owner Submittals
	var vProcessID = getProcessID("Application Acceptance", capId);
	var vProcessCode = getProcessCode("Application Acceptance", capId);
	var vTaskStepNum;
	vTaskStepNum = getTaskStepNumber(vProcessCode, "Application Acceptance", capId);
	resultWorkflowTask("Application Acceptance", "Awaiting Owner Submittals", "Update by DO_APPLICATION_SUBMITTED_ACTIONS", "Update by DO_APPLICATION_SUBMITTED_ACTIONS");
	runWTUAForWFTaskWFStatus("Application Acceptance", vProcessID, vTaskStepNum, "Awaiting Owner Submittals", capId);
}
// End script to do application submittal actions