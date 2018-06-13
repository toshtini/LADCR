function updateContactAddressFromAddressType(itemCap,pContactType, pAddressType)
{
// This populates the address fields on the contact from the designated address type.
// This was created for reports that access the contact single address fields.
// Parameters:
//		itemCap - capId
//		pContactType - Contact Type to be updated, finds the first one
//		pAddressType - Address Type from which to transfer, finds first one
// Returns true if update occurs.
// Can call from
//	ASA:~
//	CEA:~
//	CTRCA:~
// Created 06/05/2018, ghess

try{

	//aa.print("Inside updateHaulerAddress...");

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
			haulerAddress = targetContact.addresses[addr]
			//aa.print("addressType = " + haulerAddress.addressType);
			if (haulerAddress.addressType == pAddressType){
				//aa.print("haulerAddress.addressLine1: " + haulerAddress.addressLine1 );
				//aa.print("haulerAddress.city: " + haulerAddress.city);
				//aa.print("haulerAddress.state: " + haulerAddress.state);
				//aa.print("haulerAddress.zip: " + haulerAddress.zip);
				newAddrLine1 = haulerAddress.addressLine1;
				newAddrCity = haulerAddress.city;
				newAddrState = haulerAddress.state;
				newAddrZip = haulerAddress.zip;
				break;
			}
		}

		//myResult = targetContact.people.getCompactAddress().getAddressLine1();
		//aa.print(" myResult = " + myResult); 
		
		if (newAddrLine1 != "") {
			targetContact.people.getCompactAddress().setAddressLine1(newAddrLine1);
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
