//Routine addition for PRA:LICENSES/*/*/APPLICATION
var vEmailTemplate = "LADCR LOCAL AUTHORIZATION PAYMENT NOTICE";
var vReportTemplate = "Local Authorization Notification";
var rtf = ["Licenses", null, null, "Application"];
var contactString = "Owner Applicant,Business Owner,Business,Primary Contact Person";

	// if balance due = 0 send authorization notice
	if (balanceDue <=0) {
		//Generate license report and email
		var vEParams = aa.util.newHashtable();
		var vRParams = aa.util.newHashtable();
		addParameter(vRParams, "p1Value", capId.getCustomID());

		emailContacts_BCC(contactString, vEmailTemplate, vEParams, vReportTemplate, vRParams);
		logDebug(vReportTemplate + " generated for record " + capId.getCustomID());
	}
