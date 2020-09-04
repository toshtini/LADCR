// COPY_APP_TO_RENEWAL
// last update: 09/04/2020
	//showDebug = true;
	//logDebug("Starting COPY_APP_TO_RENEWAL...");

	// Main test code goes here...
	altId = capId.getCustomID();
	//parentCapId = getParent();

	//Copy from parent
	editAppName(getAppName(parentCapId));
	//logDebug("Parent Legal Biz Name = " + getAppName(parentCapId));

	updateShortNotes(getShortNotes(parentCapId));
	//logDebug("Parent DBAName = " + getShortNotes(parentCapId));

	editPriority(getPriority(parentCapId));
	//logDebug("Parent Priority = " + getPriority(parentCapId));

	copyAddress(parentCapId, capId);
