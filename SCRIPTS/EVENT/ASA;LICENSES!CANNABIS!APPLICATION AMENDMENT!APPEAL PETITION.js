// Invoice Appeal Petition Fee
updateFee("J099","CAN_APP_PET","FINAL",1,"Y");
// Send Fee Notice
if (publicUser == false) {
  var parentId = getParent();
  //aa.print("parentId = " + parentId);
  copyContacts3_0(parentId, capId);
  include("SEND_APPEAL_PETITION_FEE_NOTICE");
}
