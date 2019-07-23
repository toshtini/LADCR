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
		sendNotification(null,refContactEmail,"","LACDR_SOCIAL_EQUITY_STATUS_CHANGE_ALERT",vEParams,null,capArray[0]); 
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

function loadRefAttr(people) {
var asiObj = null;
var asi = new Array();    // associative array of attributes
var customFieldsObj = null;
var customFields = new Array();
var customTablesObj = null;
var customTables = new Array();

//Attributes
if (people.getAttributes() != null) {
	asiObj = people.getAttributes().toArray();
	if (asiObj != null) {
		for (var xx1 in asiObj) {
			logDebug("ATT : " + asiObj[xx1].attributeName + " = " + asiObj[xx1]);
			asi[asiObj[xx1].attributeName] = asiObj[xx1];
		}   
	}
}

// contact ASI
var tm = people.getTemplate();
if (tm)	{
	var templateGroups = tm.getTemplateForms();
	var gArray = new Array();
	if (!(templateGroups == null || templateGroups.size() == 0)) {
		var subGroups = templateGroups.get(0).getSubgroups();
		if (!(subGroups == null || subGroups.size() == 0)) {
			for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
				var subGroup = subGroups.get(subGroupIndex);
				var fields = subGroup.getFields();
				if (!(fields == null || fields.size() == 0)) {
					for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
						var field = fields.get(fieldIndex);
						logDebug("ASI : " + field.getDisplayFieldName() + " = " + field.getDefaultValue());
						asi[field.getDisplayFieldName()] = field.getDefaultValue();
					}
				}
			}
		}
	}
}

	
	return asi;
}
