// Begin script to set 'Awaiting Data Entry' for back office submittals. Runs the WTUA event for Application Acceptance - Awaiting Data Entry
if (!publicUser && isTaskActive("Application Acceptance") && balanceDue == 0) {
	var vProcessID = getProcessID("Application Acceptance", capId);
	var vProcessCode = getProcessCode("Application Acceptance", capId);
	var vTaskStepNum;
	vTaskStepNum = getTaskStepNumber(vProcessCode, "Application Acceptance", capId);
	resultWorkflowTask("Application Acceptance", "Awaiting Data Entry", "Update by AWAITING_DATA_ENTRY", "Update by AWAITING_DATA_ENTRY");
	runWTUAForWFTaskWFStatus("Application Acceptance", vProcessID, vTaskStepNum, "Awaiting Data Entry", capId);
}
// End script to set 'Awaiting Data Entry' for back office submittals
