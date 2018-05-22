//Begin script to link amendment to application when user Defers Payment in ACA
var vParentId;
vParentId = "" + aa.env.getValue("ParentCapID");
if (vParentId == false || vParentId == null || vParentId == "") {
     var vAppId = getAppSpecific("Application ID");
     if (vAppId != "" && vAppId != null) {
           addParent(vAppId);
     }
}

// Send Fee Notice
if (publicUser == true) {
  //var parentId = getParent();
  //copyContacts3_0(parentId, capId);
  include("SEND_APPEAL_PETITION_FEE_NOTICE");
}
