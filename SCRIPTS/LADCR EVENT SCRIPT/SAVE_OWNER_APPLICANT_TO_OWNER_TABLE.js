// Begin script to copy Owner Application information to the Owners ASIT. This should only happen if business structure is "Sole Owner"
var vTableName = "LIST OF OWNERS";
var vOwnerTable = loadASITable(vTableName);
var vBusiness = getContactObj(capId, "Business");
var vBusinessType = vBusiness.asi["5006(b)(14) Business Organization Structure"];

if (publicUser && (!vOwnerTable || vOwnerTable == null || vOwnerTable.length == 0) && vBusinessType == "Sole Owner") {
	var vOwnerApplicant = getContactObj(capId, 'Owner Applicant');
	var vOwnerAddresses;
	var vOwnerAddress;
	var vAddressType;
	var x;
	var vFName;
	var vLName;
	var vTitle;
	var vPhone;
	var vEmail;
	var vAddrLine1;
	var vAddrLine2;
	var vCity;
	var vState;
	var vZip;
	var vAsitFieldArray = [];
	var asitFieldsRow1;
	if (vOwnerApplicant != null && vOwnerApplicant != false) {
		vFName = vOwnerApplicant.people.firstName;
		vLName = vOwnerApplicant.people.lastName;
		vPhone = vOwnerApplicant.people.phone1;
		vEmail = vOwnerApplicant.people.email;
		vOwnerAddresses = vOwnerApplicant.addresses;

		x = 0;
		for (x in vOwnerAddresses) {
			vOwnerAddress = vOwnerAddresses[x];
			vAddressType = vOwnerAddress.getAddressType();
			if (vAddressType = "Mailing") {
				vAddrLine1 = vOwnerAddress.getAddressLine1();
				vAddrLine2 = vOwnerAddress.getAddressLine2();
				vCity = vOwnerAddress.getCity();
				vState = vOwnerAddress.getState();
				vZip = vOwnerAddress.getZip();
				break; //assume only one
			}
		}

		/*
		aa.print(vFName);
		aa.print(vLName);
		aa.print(vPhone);
		aa.print(vEmail);
		aa.print(vAddrLine1);
		aa.print(vAddrLine2);
		aa.print(vCity);
		aa.print(vState);
		aa.print(vZip);
		 */

		// Save values in uppercase to match manual entry
		if (vAddrLine1 != null && vAddrLine1 != "") {
			vAddrLine1 = vAddrLine1 + "";
			vAddrLine1 = vAddrLine1.toUpperCase();
		}
		if (vAddrLine2 != null && vAddrLine2 != "") {
			vAddrLine2 = vAddrLine2 + "";
			vAddrLine2 = vAddrLine2.toUpperCase();
		}
		if (vCity != null && vCity != "") {
			vCity = vCity + "";
			vCity = vCity.toUpperCase();
		}
		if (vState != null && vState != "") {
			vState = vState + "";
			vState = vState.toUpperCase();
		}

		//Create a map to save the field and value map.
		asitFieldsRow1 = aa.util.newHashMap(); // Map<columnName, columnValue>
		asitFieldsRow1.put("First Name", vFName);
		asitFieldsRow1.put("Last Name", vLName);
		asitFieldsRow1.put("Phone Number", vPhone);
		asitFieldsRow1.put("Email Address", vEmail);
		asitFieldsRow1.put("Address Line 1", vAddrLine1);
		asitFieldsRow1.put("Address Line 2", vAddrLine2);
		asitFieldsRow1.put("City", vCity);
		asitFieldsRow1.put("State", vState);
		asitFieldsRow1.put("Zip Code", vZip);

		// Populate Title and Percentage if "Sole Owner"
		if (vBusinessType == "Sole Owner") {
			asitFieldsRow1.put("Title", "Controlling Member");
			asitFieldsRow1.put("Ownership Percentage", "100");
		}

		vAsitFieldArray.push(asitFieldsRow1);

		//Create the ASIT Rows
		addAppSpecificTableInfors(vTableName, capId, vAsitFieldArray);
	}
}
// End script to copy Owner Application information to the Owners ASIT.
