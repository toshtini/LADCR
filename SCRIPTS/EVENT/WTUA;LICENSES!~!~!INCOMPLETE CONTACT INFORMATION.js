
if (wfTask.equals("Review") && wfStatus.equals("Changes Accepted")) {

	if (parentCapId) {
		//  remove all contacts from parent
		capContactResult = aa.people.getCapContactByCapID(parentCapId);
		if (capContactResult.getSuccess()) {
			var contacts = capContactResult.getOutput();
			for (var i in contacts) {
				var capContactNumber = aa.util.parseInt(contacts[i].getCapContactModel().getPeople().getContactSeqNumber());
				aa.people.removeCapContact(parentCapId, capContactNumber);
				logDebug("Contact Seq Number " + capContactNumber + " removed from parent " + parentCapId);
			}
		}
	}

	//  copy from amendment to parent
	copyContacts(capId, parentCapId);
}
