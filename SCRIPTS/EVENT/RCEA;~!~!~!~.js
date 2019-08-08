//07/17/2019 - ghess, added Salutation debug for non-public users
if (publicUser) {
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var seStatus = people.getSalutation();
	var asi  = loadRefAttr(people);
	if ((!seStatus || "".equals(seStatus)) && "Y".equals(asi["Final Submittal"])) {
		// final submittal with no status, let's set it up.
		people.setSalutation("Pending DCR Review");
		var result = aa.people.editPeople(people);
		logDebug("edited salutation success? " + result.getSuccess());
		// notification
		params = aa.util.newHashtable();
		addParameter(params, "$$LastName$$", people.getLastName());
		addParameter(params, "$$FirstName$$", people.getFirstName());
		addParameter(params, "$$MiddleName$$", people.getMiddleName());
		addParameter(params, "$$BusinesName$$", people.getBusinessName());
		addParameter(params, "$$Phone1$$", people.getPhone1());
		addParameter(params, "$$Phone2$$", people.getPhone2());
		addParameter(params, "$$Email$$", people.getEmail());
		addParameter(params, "$$AddressLine1$$", people.getCompactAddress().getAddressLine1());
		addParameter(params, "$$AddressLine2$$", people.getCompactAddress().getAddressLine2());
		addParameter(params, "$$City$$", people.getCompactAddress().getCity());
		addParameter(params, "$$State$$", people.getCompactAddress().getState());
		addParameter(params, "$$Zip$$", people.getCompactAddress().getZip());
		addParameter(params, "$$Fax$$", people.getFax());
		addParameter(params, "$$Country$$", people.getCompactAddress().getCountry());
		addParameter(params, "$$FullName$$", people.getFullName());
  		aa.document.sendEmailByTemplateName("dcrlicensing@lacity.org","birdsnack@gmail.com","","LADCR Social Equity Application Alert",params,[]);
	}
} else {

	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var seStatus = people.getSalutation();
	logDebug("Salutation:  " + seStatus);
}

if (!publicUser)
	{
	// If Agency updates the Social Equity Status email reference contact
	var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
	var capArray = new Array;
	pSeqNumber = ContactModel.getContactSeqNumber()
	pSeqNumber = aa.util.parseInt(pSeqNumber)
	pSeqNumber = aa.util.parseLong(pSeqNumber)
	capArray = getCapIDsByRefContactNBR(pSeqNumber)
	var afterEditSocialEquity = people.getSalutation();
	var refContactEmail = people.getEmail();
	var beforeEditSocialEquity = lookup("LADCR_REFCONTACT_SOCIALEQUITY_STATUS",ContactModel.getContactSeqNumber())
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$oldSEStatus$$",beforeEditSocialEquity);
	addParameter(vEParams, "$$newSEStatus$$",afterEditSocialEquity);
	if(afterEditSocialEquity != beforeEditSocialEquity)
		{
		editLookup ("LADCR_REFCONTACT_SOCIALEQUITY_STATUS", ContactModel.getContactSeqNumber(), afterEditSocialEquity)
		sendNotification(null,refContactEmail,"","LADCR_SOCIAL_EQUITY_STATUS_CHANGE_ALERT",vEParams,null,capArray[0]); 
		}
	}


// When a Reference Contact is saved update any related record's transactional contacts
var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();
var capArray = new Array;
var pSeqNumber = ContactModel.getContactSeqNumber()
pSeqNumber = aa.util.parseInt(pSeqNumber)
pSeqNumber = aa.util.parseLong(pSeqNumber)
capArray = getCapIDsByRefContactNBR(pSeqNumber)
if(capArray.length > 0)
	{
	for (aCap in capArray)
		{
		// loop through the related Caps
		var thisCap = capArray[aCap]
		logDebug("thisCap " + thisCap)
		var capContactResult = aa.people.getCapContactByCapID(thisCap);
		// loop through any cap contacts
		if (capContactResult.getSuccess()) {
			var Contacts = capContactResult.getOutput();
			for (yy in Contacts) {
				logDebug("getContactSeqNumber " + Contacts[yy].getCapContactModel().getContactSeqNumber());
				var thisContactModel = Contacts[yy].getCapContactModel();
				var syncResult = aa.people.syncCapContactFromReference(thisContactModel, people);
				if(syncResult.getSuccess())
					{
					logDebug("Cap contact synchronized successfully!");
					}
				else
					{
					logDebug("Cap contact synchronized. " + syncResult.getErrorMessage());
					}
				}
			}
		}
	}
	
	// now update any records Custom List with the reference contact identified in the Contact Sequence Number column
	updateASITRefContact("LIST OF OWNERS","CAN_BUS_APP","Contact Sequence Number",ContactModel.getContactSeqNumber(),people.firstName,people.lastName,people.phone1,people.email)
	


	

