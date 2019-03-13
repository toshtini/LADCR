//if ((wfTask == "Initial Review" || wfTask == "Review") && wfStatus == "Additional Info Requested") { // modified 11/27/18
if (wfStatus == "Additional Info Requested") {
	//populate contact single address fields for report
	updateContactAddressFromAddressType(capId,"Owner Applicant","Mailing");

	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	addParameter(vEParams, "$$businessName$$", capName);
	var vRParams = aa.util.newHashtable();
	addParameter(vRParams, "p1Value", capIDString);
	emailContacts_BCC("All", "DCA INCOMPLETE APPLICATION NOTICE", vEParams, "Incomplete Application Letter", vRParams);
}
