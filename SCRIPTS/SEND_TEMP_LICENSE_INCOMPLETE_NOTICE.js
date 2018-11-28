if (wfStatus.equals("Temporarily Approved") || wfStatus.equals("Temp License Granted") || wfStatus.equals("Temp License Granted with Issues")) {
	if (wfStatus.equals("Temp License Granted with Issues")) 
		{addStdCondition("License Conditions", "Temp License Granted with Issues")}
	
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	emailContacts_BCC("All", "DCA TEMP LICENSE INCOMPLETE LIST", vEParams, "", "");
}
