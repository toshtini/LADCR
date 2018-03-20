// Begin script to check that Owner Applicant and Business Owner count matches the Owners ASIT
if ((wfTask == "Application Acceptance" && wfStatus == "Application Received") || (wfTask == "Initial Review" && wfStatus == "Recommend Approval")) {
	var parentId = null;
	var numberOfOwners;
	var numberOfParentContacts;
	var parentOwnerTable;

	numberOfOwners = 0;
	parentOwnerTable = loadASITable("LIST OF OWNERS");
	if (parentOwnerTable && parentOwnerTable != null) {
		numberOfOwners = parentOwnerTable.length;
	}
	
	//numberOfOwners = numberOfOwners + 1; //Owner Applicant
	
	numberOfParentContacts = 0;
	conArray = getContactObjsByCap_BCC(capId);
	for (var cIndex in conArray) {
		thisContact = conArray[cIndex];
		if (thisContact.type == "Business Owner") {
			numberOfParentContacts++;
		}
	}
	
	logDebug("numberOfOwners: "  + numberOfOwners);
	logDebug("numberOfParentContacts: " + numberOfParentContacts);
	
	if (numberOfOwners != numberOfParentContacts) {
		cancel = true;
		showMessage = true;
		comment("'" + wfStatus + "' cannot be selected because not all Owner Submittals have been processed");
	}
}
// Begin script to check that Owner Applicant and Business Owner count matches the Owners ASIT
