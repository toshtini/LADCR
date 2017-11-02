//Start - License Creation/Update Script
if (wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Provisionally Issued" || wfStatus == "Temporarily Issued")) {
	var vParentArry;
	var vLicenseID;
	var tmpCap;
	var vParentLicType;
	var vParentLicTypeString;
	var vLicenseObj;
	var vExpDate;
	var vToday;
	var vToday_mm;
	var vEndOfMonth;

	if (wfStatus == "Temporarily Issued") {
		vParentLicTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "Temporary License";
		vParentLicType = "Temporary License";
	} else {
		vParentLicTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "License";
		vParentLicType = "License"
	}

	//Check if the record already has a parent of the correct type.
	//The correct type has the same top three levels of the record type
	//hierarchy as the current record but the fourth level is
	//'License' instead of 'Application'.
	//If no license exists create one.
	//
	vParentArry = getParents(vParentLicTypeString);
	if (vParentArry != null && vParentArry != "") {
		vLicenseID = vParentArry[0]
	} else if (appTypeArray[3] == "Application") {
		vLicenseID = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], vParentLicType, getAppName(capId));
	}

	//If the current record is an application record and the parent license
	//record does not exist or the current record is a renewal record and
	//the parent license does exist then update the license records info
	if (appTypeArray[3] == "Application" && vParentArry == null) {
		//Copy Parcels from child to license
		copyParcels(capId, vLicenseID);

		//Copy addresses from child to license
		copyAddress(capId, vLicenseID);

		//Copy ASI from child to license
		copyASIInfo(capId, vLicenseID);

		//Copy ASIT from child to license
		copyASITables(capId, vLicenseID);

		//Copy Contacts from child to license
		copyContacts3_0(capId, vLicenseID);

		//Copy Work Description from child to license
		aa.cap.copyCapWorkDesInfo(capId, vLicenseID);

		//Copy application name from child to license
		editAppName(getAppName(capId), vLicenseID);

		//Update License Workflow
		tmpCap = capId;
		capId = vLicenseID;
		updateTask("Active", "Active", "Updated by WTUA:Licenses/*/*/Application", "Update by WTUA:Licenses/*/*/Application");
		capId = tmpCap;

		//Activate the license records expiration cycle
		vLicenseObj = new licenseObject(null, vLicenseID);
		vLicenseObj.setStatus("Active");

		//Add license to the CAT set;
		addToCat(vLicenseID);

		//get license object and expiration date
		vLicenseObj = new licenseObject(null, vLicenseID);
		vExpDate = vLicenseObj.b1ExpDate;
		vExpDate = new Date(vExpDate);
		LicExp_mm = vExpDate.getMonth() + 1;
		LicExp_mm = (LicExp_mm < 10) ? '0' + LicExp_mm : LicExp_mm;
		LicExp_dd = vExpDate.getDate();
		LicExp_dd = (LicExp_dd < 10) ? '0' + LicExp_dd : LicExp_dd;
		LicExp_yyyy = vExpDate.getFullYear();
		vExpDateString = LicExp_mm + "/" + LicExp_dd + "/" + LicExp_yyyy;

		//Update expiration date
		//check if expiration date is in the past, if so add 1 to the year.
		//This is to address the issue where the default expiration is always the current year, even if the date is in the past.
		vToday = new Date();
		if (vExpDate <= vToday) {
			LicExp_mm = vExpDate.getMonth() + 1;
			LicExp_mm = (LicExp_mm < 10) ? '0' + LicExp_mm : LicExp_mm;
			LicExp_dd = vExpDate.getDate();
			LicExp_yyyy = vExpDate.getFullYear() + 1;
			vExpDate = LicExp_mm + "/" + LicExp_dd + "/" + LicExp_yyyy;
			vLicenseObj.setExpiration(vExpDate);
		}

		//get today as a string "MM/DD/YYYY"
		vToday = new Date();
		Today_mm = vToday.getMonth() + 1;
		Today_mm = (Today_mm < 10) ? '0' + Today_mm : Today_mm;
		Today_dd = vToday.getDate();
		Today_dd = (Today_dd < 10) ? '0' + Today_dd : Today_dd;
		Today_yyyy = vToday.getFullYear();
		vTodayString = Today_mm + "/" + Today_dd + "/" + Today_yyyy;

		//get new permit status by date. if within 60 days of expiration status should be "About to Expire", else "Active"
		vLicenseObj = new licenseObject(null, vLicenseID);
		vExpDate = vLicenseObj.b1ExpDate;
		vExpDate = new Date(vExpDate);
		LicExp_mm = vExpDate.getMonth() + 1;
		LicExp_mm = (LicExp_mm < 10) ? '0' + LicExp_mm : LicExp_mm;
		LicExp_dd = vExpDate.getDate();
		LicExp_dd = (LicExp_dd < 10) ? '0' + LicExp_dd : LicExp_dd;
		LicExp_yyyy = vExpDate.getFullYear();
		vExpDateString = LicExp_mm + "/" + LicExp_dd + "/" + LicExp_yyyy;
		dateDiff = dateAdd(vExpDateString, -60);
		dateDiff = new Date(dateDiff);
		if (dateDiff < vToday) {
			vLicenseObj.setStatus("About to Expire");

			//Update License Workflow
			tmpCap = capId;
			capId = vLicenseID;
			updateTask("Issuance", "About to Expire", "Updated by WTUA:Licenses/*/*/Application", "Updated by WTUA:Licenses/*/*/Application");
			capId = tmpCap;
		}

		//Add provisional license standard condition
		if (wfStatus == "Provisionally Issued") {
			addStdCondition("License Conditions", "Provisional License", vLicenseID);
		}

		//Generate license report and email
		var vEmailTemplate;
		var vReportTemplate;

		if (wfStatus == "Temporarily Issued") {
			vEmailTemplate = "DCA TEMP LICENSE ISSUED NOTIFICATION";
			vReportTemplate = "Temporary Cannabis License";
		} else if (wfStatus == "Provisionally Issued") {
			vEmailTemplate = "";
			vReportTemplate = "";
		} else {
			vEmailTemplate = "DCA LICENSE ISSUED NOTIFICATION";
			vReportTemplate = "License - Cannabis";
		}

		var vEParams = aa.util.newHashtable();
		addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
		addParameter(vEParams, "$$ExpirationDate$$", vLicenseObj.b1ExpDate);
		addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
		var vRParams = aa.util.newHashtable();
		addParameter(vRParams, "p1Value", vLicenseID.getCustomID());

		tmpCap = capId;
		capId = vLicenseID;
		emailContacts_BCC("All", vEmailTemplate, vEParams, vReportTemplate, vRParams);
		capId = tmpCap;

		//update the initial review task and resend amendment emails
		if (wfStatus == "Temporarily Issued") {
			var vProcessID;
			var vProcessCode;
			var vTaskStepNum;
			vProcessID = getProcessID("Initial Review", capId);
			vProcessCode = getProcessCode("Initial Review", capId);
			vTaskStepNum = getTaskStepNumber(vProcessCode, "Initial Review", capId);
			resultWorkflowTask("Initial Review", "Additional Info Requested", "Updated by CREATE_LICENSE_RECORD", "Updated by CREATE_LICENSE_RECORD");
			runWTUAForWFTaskWFStatus("Initial Review", vProcessID, vTaskStepNum, "Additional Info Requested", capId);
		}
	}
	//If the current record is an application record and the parent license
	//record already exists, close the applcation record.
	if ((wfStatus == "Issued" || wfStatus == "Provisionally Issued") && (vParentArry != null || vLicenseID != null) && balanceDue <= 0) {
		closeTask("Close Out", "Issued", "Closed by WTUA:Licenses/*/*/Application", "Closed by WTUA:Licenses/*/*/Application");
	}
}
//End - License Creation/Update Script
