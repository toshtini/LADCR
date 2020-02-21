function lacdUpdateAltID_1(capIdToUpdate, recType, altId, ActivityType) {
// Last Update: 02/21/2020, ghess
	var returnAltID;

	if (recType == "PCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0, 2)
			var remainder = initialAltId.slice(4, 14);
		var APP = initialAltId.slice(14, 18);
		// Construct new Alt ID
		returnAltID = LA + "-P" + remainder + "-" + activityLetter + APP;
	}
	if (recType == "NONPCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0, 2)
			var remainder = initialAltId.slice(4, 14);
		var APP = initialAltId.slice(14, 18);
		// Construct new Alt ID
		returnAltID = LA + "-C" + remainder + "-" + activityLetter + APP;
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
	}
	
	if (returnAltID) {
		aa.cap.updateCapAltID(capIdToUpdate, returnAltID);
		logDebug("returnAltID is " + returnAltID);
		// update global var
		capIDString = returnAltID;
	}
	return(returnAltID);
}
