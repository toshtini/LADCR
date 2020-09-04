// COPY_APP_TO_RENEWAL
// last update: 09/04/2020
	showDebug = true;
	logDebug("Starting COPY_APP_TO_RENEWAL...");

	// Main test code goes here...
	altId = capId.getCustomID();
	parentCapId = getParent();
	parentAltId = parentCapId.getCustomID();
	
	logDebug("capId = " + capId);
	logDebug("altId = " + altId);
	logDebug("parentCapId = " + parentCapId);
	logDebug("parentAltId = " + parentAltId);

	//Copy from parent
	editAppName(getAppName(parentCapId));
	logDebug("Parent Legal Biz Name = " + getAppName(parentCapId));

	logDebug("Parent DBAName = " + getShortNotes(parentCapId));
	updateShortNotes(getShortNotes(parentCapId));

	logDebug("Parent Priority = " + getPriority(parentCapId));
	editPriority(getPriority(parentCapId));

	copyAddress(parentCapId, capId);
