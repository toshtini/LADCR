// Begin script to activate appeal process and send temporary denial notice - Script #45
if (wfTask == "Executive Review" && wfStatus == "Decision Appealable") {
	// advance workflow
	deactivateTask(wfTask);
	activateTask("Wait for Appeal");

	//populate contact single address fields for report
	updateContactAddressFromAddressType(capId,"Owner Applicant","Mailing");

	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	addParameter(vEParams, "$$businessName$$", capName);
	var vRParams = aa.util.newHashtable();
	addParameter(vRParams, "p1Value", capIDString);
	emailContacts_BCC("All", "DCA OWNER APPLICANT TEMP DENIED NOTIFICATION", vEParams, "Denial of License - Appealable", vRParams);
}
// End script to activate appeal process and send temporary denial notice - Script #45
