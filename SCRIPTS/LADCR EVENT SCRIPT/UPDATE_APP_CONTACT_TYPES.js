//UPDATE_APP_CONTACT_TYPES
// new contacts default to Contact Type Flag = Organization
// this checks contact types to determine which should be set to Individual and updates
// last Update: 10/01/2020

itemCap = capId;
contactArr = getContactObjsByCap_BCC(itemCap) 

for (var cIndex in contactArr) {
	var thisContact = contactArr[cIndex];
	recContType = thisContact.capContact.getContactType();
	logDebug("Checking Record Contact Type: " + recContType);
		
	var indvContactTypes = [
		"Agent for Service of Process",
		"Authorized Agent",
		"Chief Executive Officer",
		"Chief Financial Officer",
		"Chief Marketing Officer",
		"Chief Operating Officer",
		"Chief Technology Officer",
		"Consultant",
		"Director",
		"Neighborhood Liaison",
		"Owner",
		"Person-in-Charge",
		"President",
		"Secretary",
		"Social Equity Owner",
		"Vice President"
	];
	
	orgFound = false;
	for (var i=1; i<indvContactTypes.length;i++) {
		if (indvContactTypes[i] == recContType) {
			orgFound = true;
			break;
		}
	}

	if (orgFound){
		thisContact.capContact.setContactTypeFlag("individual");
		
		saveResult = aa.people.editCapContact(thisContact.capContact);
		if (saveResult.getSuccess())
			logDebug("Contact Type Flag updated to Individual");
		else
			logDebug("(contactObj) error saving base contact : " + thisContact + " : " + saveResult.getErrorMessage());

	}

}
