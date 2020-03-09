//created 3/9/2020 for Entity Ownership prototype
	if (appMatch("Licenses/Cannabis/Entity/Ownership")) {
		conArray = getContactObjsByCap_BCC(capId);
		if (conArray.length>0) {
			thisContact = conArray[0];
			updResult = aa.cap.updateCapAltID(capId,thisContact.refSeqNumber);
			logDebug("Updated Alt Id = " + thisContact.refSeqNumber);
		}
	}
