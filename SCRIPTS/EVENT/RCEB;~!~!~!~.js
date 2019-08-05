if (publicUser) {
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var seStatus = people.getSalutation();
	
	//if there is a status then dont allow saving
	if (seStatus && !(seStatus=="" || seStatus==null)) {
		cancel = true ; 
		showMessage = true;
		showDebug = false;
		comment("You cannot make any changes after applying for Social Equity Verification. Please notify DCR for any updates.");

	}
} 
