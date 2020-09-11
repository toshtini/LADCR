function lacdUpdateAltID(capIdToUpdate, recType, altId, ActivityType) {
// Last Update: 09/01/2020, ghess
	var returnAltID;

	if (recType == "PCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0, 2);
		var remainder = initialAltId.slice(4, 14);
		//var APP = initialAltId.slice(14, 18);
		// Construct new Alt ID
		returnAltID = LA + "-P" + remainder + "-APP-PREAPP";
	}
	if (recType == "ACTIVITY") {
		// like LA-C-YY-######-TYPE-APP
		var activityLetter = ActivityType;
		var initialAltId = altId;

		// This uses renewal's record number
		var parentInitId = initialAltId.slice(0,14);
		var lenOfStr = initialAltId.length();
		var parentEndId = initialAltId.slice(-3,lenOfStr);

		// Construct new Alt ID
		returnAltID = parentInitId + "-" + activityLetter + "-" + parentEndId;
	}
	if (recType == "NONPCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0, 2)
		var remainder = initialAltId.slice(4, 14);
		//var APP = initialAltId.slice(14, 18);
		// Construct new Alt ID
		returnAltID = LA + "-C" + remainder + "-APP-PREAPP";
	}
	if (recType == "RENEWAL") {
		// like LA-C-YY-######-TYPE-RENYY
		var initialAltId = altId;
		// Split out parts of the number
		var todayDate = new Date();
		var strYear = todayDate.getFullYear();
		var strYear = strYear.toString();
		var strYear = strYear.slice(2, 4);
		var yearOfRen = strYear;
		lenOfStr = initialAltId.length() - 3;
		var AltIdSlice = initialAltId.slice(0, lenOfStr);
		// Construct new Alt ID
		returnAltID = AltIdSlice + "REN" + yearOfRen;
	}

	if (recType == "APPRENEW") {
		// Phase 1 - LA-C-19-1#####-APP
		if (altId.indexOf("LA-C-19-0") == 0) {
			returnAltID = altId.replace("LA-C-19-0","LA-C-19-1");
			//logDebug("Phase 1 returnAltID is " + returnAltID);
		}
		// Phase 2 - LA-C-18-1#####-APP
		if (altId.indexOf("LA-C-18-0") == 0) {
			returnAltID = altId.replace("LA-C-18-0","LA-C-18-1");
			//logDebug("Phase 2 returnAltID is " + returnAltID);
		}
		//propegate PCN designation
		if (altId.indexOf("LA-P-") == 0) {
			var childAltId = capIdToUpdate.getCustomID();
			returnAltID = childAltId.replace("LA-C-","LA-P-");
		}
	}
	
	if (returnAltID) {
		var updResult = aa.cap.updateCapAltID(capIdToUpdate, returnAltID);
		//in case of duplicates...
		var capCount = 0;
		while(!updResult.getSuccess()){
			capCount = capCount + 1;
			returnAltID = returnAltID + "-" + capCount;
			updResult = aa.cap.updateCapAltID(capIdToUpdate, returnAltID);
		}
		logDebug("returnAltID is " + returnAltID);
		// update global var
		capIDString = returnAltID;
	}
	return(returnAltID);
}
