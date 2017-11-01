// Assess License Fees
// Set workflow to Issuance --> Waiting for Payment
// Run the WTUA event for Waiting for Payment
if (wfTask == "Supervisory Review" && (wfStatus == "Approved" || wfStatus == "Temporarily Approved")) {
	var vFeeCode;
	if (wfStatus == "Temporarily Approved") {
		vFeeCode = "ADU_MICR_04";
	}
	else {
		vFeeCode = "ADU_MICR_05";
	}
	
	updateFee(vFeeCode,"ADU_MICR_APP","FINAL",1,"Y");
	
	var vProcessID = getProcessID("Issuance", capId);
	var vProcessCode = getProcessCode("Issuance", capId);
	var vTaskStepNum;
	vTaskStepNum = getTaskStepNumber(vProcessCode, "Issuance", capId);
	resultWorkflowTask("Issuance", "Waiting for Payment", "Update by ASSESS_ADU_MICR_FEES", "Update by ASSESS_ADU_MICR_FEES");
	runWTUAForWFTaskWFStatus("Issuance", vProcessID, vTaskStepNum, "Waiting for Payment", capId);
}