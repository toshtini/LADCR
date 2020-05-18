var ca = getContactObjs(capId);

if (ca) {
	for (var i in ca) {
		var c = ca[i]; // contact
		if (matches(c.type, "Manager", "Security Firm")) {
			var oc = c.capContact;
			logDebug("Contact: " + c.type + ", current access level is " + oc.getAccessLevel() + ", setting to no access");
			oc.setAccessLevel("N"); // no access
			c.saveBase();
		}
	}
}
