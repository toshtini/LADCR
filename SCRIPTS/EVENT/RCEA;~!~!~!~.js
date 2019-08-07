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
	var table = "LIST OF OWNERS";
	var subgroup = "CAN_BUS_APP"
	var column = "Contact Sequence Number";
	var value = ContactModel.getContactSeqNumber()
	var sql = "SELECT A.B1_PER_ID1, A.B1_PER_ID2, A.B1_PER_ID3 "
	+ " FROM BAPPSPECTABLE_VALUE A "
	+ " WHERE A.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "'"
	+ " AND A.COLUMN_NAME = '" + column + "'"
	+ " AND A.GROUP_NAME = '" + subgroup  + "'"
	+ " AND TABLE_NAME = '" + table + "'"
	+ " AND ATTRIBUTE_VALUE = '" + value + "'";
	var x = doSQL(sql);
	var r = [];
	if (x) {
		for (var i in x) {
			var item = x[i];
			r.push(aa.cap.getCapID(item.B1_PER_ID1, item.B1_PER_ID2, item.B1_PER_ID3).getOutput());
		}
	}
	for (var i in r) {
		logDebug("Record[" + i + "]: " + r[i].getCustomID());
		customListColumnUpdate(r[i], table, column, value, "First Name", people.firstName)
		customListColumnUpdate(r[i], table, column, value, "Last Name", people.lastName)
		customListColumnUpdate(r[i], table, column, value, "Phone Number", people.phone1)
		customListColumnUpdate(r[i], table, column, value, "Email Address", people.email)
	}
	
function doSQL(sql) {
        try {
		var array = [];
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);

		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			aa.print("executing " + sql);
			var rSet = sStmt.executeQuery();
			while (rSet.next()) {
				var obj = {};
				var md = rSet.getMetaData();
				var columns = md.getColumnCount();
				for (i = 1; i <= columns; i++) {
								obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
				}
				obj.count = rSet.getRow();
				array.push(obj)
				}
						rSet.close();
						aa.print("...returned " + array.length + " rows");
						aa.print(JSON.stringify(array));
						return array
		} else if (sql.toUpperCase().indexOf("UPDATE") == 0) {
			aa.print("executing update: " + sql);
			var rOut = sStmt.executeUpdate();
			aa.print(rOut + " rows updated");
		} else {
			aa.print("executing : " + sql);
			var rOut = sStmt.execute();
			aa.print(rOut);
		}
		sStmt.close();
		conn.close();
	} catch (err) {
			aa.print(err.message);
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
