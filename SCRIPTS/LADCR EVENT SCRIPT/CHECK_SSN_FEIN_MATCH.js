	var fein = "00000000000000";
	var ssn = "0000";
	var btrc = "0000000000000";
	
	var b = getContactObj(capId,"Business");
	var o = getContactObj(capId,"Owner Applicant");
	
	if (b) {
		fein = "" + b.people.getFein();
		btrc = "" + b.asi["BTRC Number"];
	}
	if (o) {
		ssn = "" + o.people.getMaskedSsn();
		}
	
	logDebug("validateId(" + btrc + "," + fein + "," + ssn + ");");
	if (!validateId(btrc,fein,ssn)) {
		addStdCondition("License Conditions", "No Match on FEIN or SSN");
		}
