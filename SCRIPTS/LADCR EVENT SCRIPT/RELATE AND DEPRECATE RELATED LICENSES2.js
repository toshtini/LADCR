//RELATE AND DEPRECATE RELATED LICENSES
//update 07.26.2019

// loop through list, add as parent and deprecate

	if (typeof RELATEDAPPLICATIONS != "undefined") {
		for (var i in RELATEDAPPLICATIONS) {
			var recString = RELATEDAPPLICATIONS[i]["Application ID"];
			var recId = aa.cap.getCapID(recString).getOutput();

			if (recId) {
				appId =  recId.getID1() + "-" + recId.getID2() + "-" + recId.getID3();
				logDebug("Linking Table Entry: " + appId);
				if (appId != parentCapId) {
					addParent(recId);
				}else {
					logDebug("Existing parent: " + parentCapId);			
				}
				updateAppStatus("Deprecated","from Script",recId);
			}
		}
	}
