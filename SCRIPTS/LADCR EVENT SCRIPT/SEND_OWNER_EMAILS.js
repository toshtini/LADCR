//Send email to all owners in the Owner table, User Story 1627. Updated 1/9/19
var sendNotification = false;
if (wfTask == "Application Acceptance" && wfStatus == "Awaiting Owner Submittals") {
	//var reportName = "Owner Submittal Letter(s)";
	var reportName = "Owner Submittal Letter - Accept";
	sendNotification = true;
} 
//not until LiveScan is available
//else {
//if (wfTask == "Owner Review" && wfStatus == "Awaiting Owner Submittals") {
//	var reportName = "Owner Submittal Letter - License";
//	sendNotification = true;
//}}

if(sendNotification) {
	var owner;
	var vEParams;
	var vEmail;
	var vRParams;
	if (typeof(LISTOFOWNERS) == "object") {
		for (var ownerIndex in LISTOFOWNERS) {
			owner = LISTOFOWNERS[ownerIndex];
			vEParams = aa.util.newHashtable();
			vEmail = owner["Email Address"] + "";
			if (vEmail != null && vEmail != "") {
				addParameter(vEParams, "$$OwnerName$$", owner["First Name"] + " " + owner["Last Name"]);
				addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
				addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
				addParameter(vEParams, "$$ApplicationID$$", capIDString);
				addParameter(vEParams, "$$businessName$$", capName);
				
				vRParams = aa.util.newHashtable();
				addParameter(vRParams, "p1Value", capIDString);
				//send email for each ASIT entry
				emailAsync_BCC(vEmail, "DCA OWNER SUBMITTAL REQUIRED NOTIFICATION", vEParams, reportName, vRParams, "", "");
			}
		}
	}
	/*
	//Send email to Owner Applicants
	vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	vRParams = aa.util.newHashtable();
	addParameter(vRParams, "p1Value", capIDString);
	emailContacts_BCC('Owner Applicant', "DCA OWNER SUBMITTAL REQUIRED NOTIFICATION", vEParams, reportName, vRParams);
	 */
}
