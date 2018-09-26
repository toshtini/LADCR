//Begin script to link amendment to application when user Defers Payment in ACA
var vParentId;
vParentId = "" + aa.env.getValue("ParentCapID");
if (vParentId == false || vParentId == null || vParentId == "") {
     var vAppId = getAppSpecific("Application ID");
     if (vAppId != "" && vAppId != null) {
           addParent(vAppId);
     }
}
//Begin script to invoice all fees when user Defers Payment in ACA. 
//Also tries to set workflow task Application Acceptance to Waiting for Payment for another rec type
include("WAITING_FOR_PAYMENT");

// Send Fee Notice
if (publicUser == true) {
  var parentId = getParent();
  copyContacts3_0(parentId, capId);
  include("SEND_APPEAL_PETITION_FEE_NOTICE");
}
