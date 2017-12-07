// Copy Business Owner contact to parent application
if (wfTask == "Review" && wfStatus == "Review Completed") {
//Send email to all contacts when application is submitted in back office. Email is to let them know the application number and fee amount accepted, User Story 1625
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	var vRParams = aa.util.newHashtable();
	addParameter(vRParams, "p1Value", capIDString);
	emailOwnercts_BCC('Business Owner', "LADCR_OWNER_INVOICE", vEParams, "Invoice", vRParams);
}
