// Assess License Fees
// Set workflow to Issuance --> Waiting for Payment
// Run the WTUA event for Waiting for Payment
if (wfTask == "Supervisory Review" && (wfStatus == "Approved" || wfStatus == "Temporarily Approved")) {
	var vFeeCode;
	if (wfStatus == "Temporarily Approved") {
		vFeeCode = "MED_RET_04";
	}
	else {
		vFeeCode = "MED_RET_05";
	}
	
	updateFee(vFeeCode,"MED_RET_APP","FINAL",1,"Y");
	
	var vProcessID = getProcessID("Issuance", capId);
	var vProcessCode = getProcessCode("Issuance", capId);
	var vTaskStepNum;
	vTaskStepNum = getTaskStepNumber(vProcessCode, "Issuance", capId);
	resultWorkflowTask("Issuance", "Waiting for Payment", "Update by ASSESS_MED_RET_FEES", "Update by ASSESS_MED_RET_FEES");
	runWTUAForWFTaskWFStatus("Issuance", vProcessID, vTaskStepNum, "Waiting for Payment", capId);
}