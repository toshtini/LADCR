//Begin script to invoice all fees and set workflow task Application Acceptance to Waiting for Payment when user Defers Payment in ACA
if (feeAmountAll(capId,"NEW") > 0 && balanceDue == 0) {
	invoiceFeeAllNew(capId);
	updateTask("Application Acceptance","Waiting for Payment","Updated by WAITING_FOR_PAYMENT","Updated by WAITING_FOR_PAYMENT");
}
//End script to invoice all fees and set workflow task Application Acceptance to Waiting for Payment when user Defers Payment in ACA
