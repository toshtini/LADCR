//RELATE AND DEPRECATE RELATED LICENSES

// loop through list, add as parent and deprecate

if (typeof RELATEDAPPLICATIONS != "undefined") {
	for (var i in RELATEDAPPLICATIONS) {
		var recString = RELATEDAPPLICATIONS[i]["Application ID"];
		logDebug("rec: " + recString);
		var recId = aa.cap.getCapID(recString).getOutput();
		if (recId) {
			addParent(recId);
			updateAppStatus("Deprecated","from Script",recId);
		}
	}
}
