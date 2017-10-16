if (publicUser && isAmendment()) {
  editAppSpecific("Application ID","");
  }

// Begin script to associate parent application to owner submittal
if (!publicUser) {
	if (AInfo["Application ID"] && AInfo["Application ID"] != "") {
		var parentIdResult = aa.cap.getCapID(AInfo["Application ID"]);
		if (parentIdResult.getSuccess()) {
			var parentId = parentIdResult.getOutput();
			if (parentId) {
				addParent(parentId);
			}
		}
	}
}
// End script to associate parent application to owner submittal

// Begin script to insert the public user reference contact as the business owner
include("COPY_PUBLIC_USER_TO_BUSINESS_OWNER");
// Begin script to insert the public user reference contact as the business owner

// Begin script to copy application name and busines owner to the owner submittal record name
include("SAVE_OWNER_SUBMITTAL_APP_NAME");
// End script to copy application name and busines owner to the owner submittal record name

// Begin script to copy the address from the application to the owner submittal
include("COPY_APP_ADDRESS_TO_OWNER_SUBMITTAL");
// End script to copy the address from the application to the owner submittal
