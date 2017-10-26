// Begin script to move workflow task Issuance to Issued, Temporarily Issued, or Provisionally Issued once payment has been recieved. Runs thr WTUA event for the given type of issuance.
if (isTaskActive("Issuance") && isTaskStatus("Issuance", "Waiting for Payment") && balanceDue == 0) {
	var vProcessID;
	var vProcessCode;
	var vTaskStepNum;
	var vIssuanceType;
	if (isTaskStatus("Supervisory Review", "Temporarily Approved")) {
		vIssuanceType = "Temporarily Issued"
	} else if (isTaskStatus("Supervisory Review", "Provisionally Approved")) {
		vIssuanceType = "Provisionally Issued"
	} else {
		vIssuanceType = "Issued"
	}
	vProcessID = getProcessID("Issuance", capId);
	vProcessCode = getProcessCode("Issuance", capId);
	vTaskStepNum = getTaskStepNumber(vProcessCode, "Issuance", capId);
	resultWorkflowTask("Issuance", vIssuanceType, "UPDATE_APPLICATION_ISSUANCE", "Update by UPDATE_APPLICATION_ISSUANCE");
	runWTUAForWFTaskWFStatus("Issuance", vProcessID, vTaskStepNum, vIssuanceType, capId);		
}
// End script to move workflow task Issuance to Issued, Temporarily Issued, or Provisionally Issued once payment has been recieved. Runs thr WTUA event for the given type of issuance.