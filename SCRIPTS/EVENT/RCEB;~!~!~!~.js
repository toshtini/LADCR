/*

// using expression for this now.
if (publicUser) {
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var seStatus = people.getSalutation();
	logDebug("seStatus is " + seStatus);
	if (matches(seStatus,"Pending DCR Review","Not Eligible","SEP Tier 1 and Tier 2 Eligibility Verified","SEP Tier 2 Eligibility Verified","SEP Tier 1 Eligibility Verified")) {
		cancel = true;
		showMessage = true;
		showDebug = false; // prevent debug
		comment("No changes can be made to your profile at this time");
		}
}

*/

if (!publicUser)
	{
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var beforeEditSocialEquity = people.getSalutation();
	if(beforeEditSocialEquity != null)
		{
		//update standard choice value for this reference contact to be read on the RCEA event to see if it has changed
		var refContactSeqNo = ContactModel.getContactSeqNumber();
		var refContactSEStatus = lookup("LADCR_REFCONTACT_SOCIALEQUITY_STATUS",refContactSeqNo)
		// if found do an edit
		if(refContactSEStatus != undefined)
			{
			editLookup ("LADCR_REFCONTACT_SOCIALEQUITY_STATUS", refContactSeqNo, beforeEditSocialEquity)
			}
		else
		// if not do an add
			{
			addLookup ("LADCR_REFCONTACT_SOCIALEQUITY_STATUS", refContactSeqNo, beforeEditSocialEquity)
			}
		}
	}
