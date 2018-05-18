// Invoice Appeal Petition Fee
updateFee("CAN_APP_01","CAN_APP_PET","FINAL",1,"Y");
// Send Fee Notice
if (publicUser == false) {
  include("SEND_APPEAL_PETITION_FEE_NOTICE");
}
