function lacdUpdateAltID(capIdToUpdate,recType,altId, ActivityType)
	{
	if (recType == "PCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0,2)
		var remainder = initialAltId.slice(4,14);
		var APP =  initialAltId.slice(14,18);
		// Construct new Alt ID
		var returnAltID = LA + "-P" + remainder + "-" + activityLetter + APP
		aa.cap.updateCapAltID(capIdToUpdate, returnAltID)
		logDebug("returnAltID is " + returnAltID)
		}
	if (recType == "NONPCN") {
		// like LA-C-YY-######-TYPE-APP
		var initialAltId = altId;
		var activityLetter = ActivityType;
		// Split out parts of the number
		var LA = initialAltId.slice(0,2)
		var remainder = initialAltId.slice(4,14);
		var APP =  initialAltId.slice(14,18);
		// Construct new Alt ID
		var returnAltID = LA + "-C" + remainder + "-" + activityLetter + APP
		aa.cap.updateCapAltID(capIdToUpdate, returnAltID)
		logDebug("returnAltID is " + returnAltID)
        }
    if (recType == "RENEWAL") {
		// like LA-C-YY-######-TYPE-RENYY
		var initialAltId = altId;
		// Split out parts of the number
		var todayDate = new Date()
		var strYear = todayDate.getFullYear()
		var strYear = strYear.toString()
		var strYear = strYear.slice(2,4)
		var yearOfRen = strYear
		lenOfStr = initialAltId.length()-3
		var AltIdSlice =  initialAltId.slice(0,lenOfStr);
		// Construct new Alt ID
		var returnAltID = AltIdSlice + "REN" + yearOfRen
		aa.cap.updateCapAltID(capIdToUpdate, returnAltID)
		logDebug("returnAltID is " + returnAltID)
		}	
	}
