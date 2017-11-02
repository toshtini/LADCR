// Copy Business contact information (Business Name and Address) to record
//if ((publicUser && vEventName == "ConvertToRealCAPAfter") || (!publicUser && vEventName == "ApplicationSubmitAfter")) {
	// Get Business contact object
	var vBusinesses = getContactObjsByCap_BCC(capId, 'Business');
	var vBusiness;
	var vBusinessObj;
	var vAddresses = [];
	var vAddress;
	var x = 0;
	var vCapScriptModel;
	var vCapModel;
	var vAddrModel;

	// Save the business name to the app name if it doesn't exist. This can happen when the ACA user selects defer payment and the ASA event actions do not save.
	if (vBusinesses && (getAppName() == null || getAppName == "")) {
		// Assume only one business contact
		vBusiness = vBusinesses[0];

		// Save business name
		vBusinessObj = vBusiness.people;
		// If contact type is individual use the contact type 2
		if (vBusinessObj.getContactTypeFlag() == "individual") {
			editAppName(vBusinessObj.getBusinessName2());
		}
		// For all others use Use DBA/Trade name if provided
		else if (vBusinessObj.getTradeName() != null && vBusinessObj.getTradeName() != "") {
			editAppName(vBusinessObj.getTradeName());
		} 
		// Use Business Name as a last resort
		else if (vBusinessObj.getBusinessName() != null && vBusinessObj.getBusinessName() != "") {
			editAppName(vBusinessObj.getBusinessName());
		}

		// Save address to the record if it doesn't already exists. This can happen when the ACA user selects defer payment and the ASA event actions do not save.
		vAddresses = vBusiness.addresses;
		if (vAddresses && getAddress(capId) == null) {
			x = 0;
			for (x in vAddresses) {
				vAddress = vAddresses[x];
				// Use only the Premise address type - assumes only one
				if (vAddress.getAddressType() == "Premise") {
					// Get transactional address model
					vCapScriptModel = aa.cap.getCap(capId).getOutput();
					vCapModel = vCapScriptModel.getCapModel();
					vAddrModel = vCapModel.getAddressModel();

					// Populate address model with Businss address info
					vAddrModel.setHouseNumberStart(vAddress.getHouseNumberStart());
					vAddrModel.setStreetPrefix(vAddress.getStreetPrefix());
					vAddrModel.setStreetName(vAddress.getStreetName());
					vAddrModel.setStreetSuffix(vAddress.getStreetSuffix());
					vAddrModel.setStreetSuffixdirection(vAddress.getStreetSuffixDirection());
					vAddrModel.setUnitStart(vAddress.getUnitStart());
					vAddrModel.setUnitType(vAddress.getUnitType());
					vAddrModel.setCity(vAddress.getCity());
					vAddrModel.setState(vAddress.getState());
					vAddrModel.setZip(vAddress.getZip());
					vAddrModel.setPrimaryFlag('Y');
					vAddrModel.setCapID(capId);
					vAddrModel.setAuditID('ADMIN');

					// Save the address
					var vAddrResult = aa.address.createAddress(vAddrModel);
					if (!vAddrResult.getSuccess()) {
						logDebug("Failed creating transactional address. " + vAddrResult.getErrorMessage());
					}

					// Exit loop - assumes only one Business address type
					break;
				}
			}
		}
	}
//}