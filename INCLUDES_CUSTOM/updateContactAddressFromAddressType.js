function updateContactAddressFromAddressType(itemCap,pContactType,pAddressType)
{
// This populates the address fields on the contact from the designated address type.
// This was created for reports that access the contact address fields.
// Parameters:
//		itemCap - capId
//		pContactType - Contact Type to be updated, finds the first one
//		pAddressType - Address Type from which to transfer, finds first one
// Returns true if update occurs.
// Can call from CTRCA
// Created 06/05/2018, ghess
// 06/13/2018, Updated to include addressLine2

try{
	//aa.print("Inside updateContactAddressFromAddressType()...");

    var updateSuccess = false;
	var capContactArray = new Array();
    var cArray = new Array();
 
	var capContactResult = aa.people.getCapContactByCapID(itemCap);
	//aa.print("capContactResult.getSuccess() = " + capContactResult.getSuccess());
	if (capContactResult.getSuccess()) {
		var capContactArray = capContactResult.getOutput();
	}

    if (capContactArray) {
        for (var yy in capContactArray) {
			//aa.print("Found: " + capContactArray[yy].getPeople().contactType);
            if (capContactArray[yy].getPeople().contactType == pContactType) {
				//aa.print("Found contact type: " + pContactType);
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }
    //aa.print("getContactObj returned " + cArray.length + " contactObj(s)");
 
	var targetPeoples = cArray;
	//aa.print("targetPeoples = " + targetPeoples);

	var newAddrLine1 = "";
	var newAddrCity = "";
	var newAddrState = "";
	var newAddrZip = "";

	for (var loopk in targetPeoples)  {
		var targetContact = targetPeoples[loopk];

		for(addr in targetContact.addresses) {
			sourceAddress = targetContact.addresses[addr]
			//aa.print("addressType = " + sourceAddress.addressType);
			if (sourceAddress.addressType == pAddressType){
				//aa.print("sourceAddress.addressLine1: " + sourceAddress.addressLine1 );
				//aa.print("sourceAddress.addressLine2: " + sourceAddress.addressLine2 );
				//aa.print("sourceAddress.city: " + sourceAddress.city);
				//aa.print("sourceAddress.state: " + sourceAddress.state);
				//aa.print("sourceAddress.zip: " + sourceAddress.zip);
				newAddrLine1 = sourceAddress.addressLine1;
				newAddrLine2 = sourceAddress.addressLine2;
				newAddrCity = sourceAddress.city;
				newAddrState = sourceAddress.state;
				newAddrZip = sourceAddress.zip;
				break;
			}
		}
		//myResult = targetContact.people.getCompactAddress().getAddressLine1();
		//aa.print(" myResult = " + myResult); 
		
		if (newAddrLine1 != "") {
			targetContact.people.getCompactAddress().setAddressLine1(newAddrLine1);
			targetContact.people.getCompactAddress().setAddressLine2(newAddrLine2);
			targetContact.people.getCompactAddress().setCity(newAddrCity);
			targetContact.people.getCompactAddress().setState(newAddrState);
			targetContact.people.getCompactAddress().setZip(newAddrZip);
			targetContact.save();
			updateSuccess = true;
			logDebug("Saved contact address data");
			break;
		}
	}
	return updateSuccess;
}
catch (err) {
    logDebug("A JavaScript Error occurred: function updateContactAddressFromAddressType(): " + err.message);
	logDebug(err.stack);
	}
}
