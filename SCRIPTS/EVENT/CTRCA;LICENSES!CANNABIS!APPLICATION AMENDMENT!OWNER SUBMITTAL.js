// check to see if this is from an amendment link.   If so, the product will set the relationship for us.

if (AInfo["Application ID"] && AInfo["Application ID"] != "") {
	var parentIdResult = aa.cap.getCapID(AInfo["Application ID"]);
	if (parentIdResult.getSuccess()) {
		var parentId = parentIdResult.getOutput();
		if (parentId) {
			addParent(parentId);
		}
	}
}

