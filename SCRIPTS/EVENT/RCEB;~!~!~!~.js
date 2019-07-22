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
		var beforeEditSocialEquityVar = null
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var beforeEditSocialEquity = people.getSalutation();
	if(beforeEditSocialEquity != null)
		{
		aa.env.setValue("beforeEditSocialEquity",beforeEditSocialEquity);
		logDebug("beforeEditSocialEquity " + aa.env.getValue("beforeEditSocialEquity") )
		}
	}
