if (feeAmountAll(capId,"NEW") > 0 && balanceDue == 0) {
	invoiceFeeAllNew(capId);
}
// Send Fee Notice
if (publicUser == true) {
  include("SEND_APPEAL_PETITION_FEE_NOTICE");
}
