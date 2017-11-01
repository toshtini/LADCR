/*------------------------------------------------------------------------------------------------------/
| Program : licenseNumberToCatJson.js
| Event   : N/A
|
| Usage   : Converts a license number into a CAT JSON object.
| By: John Towell
|
| Notes   : This file should contain all BCC specific code for gathering CAT data.
/------------------------------------------------------------------------------------------------------*/
function licenseNumberToCatJson(licenseNumber) {
    useAppSpecificGroupName = false;
    licenseNumber = '' + licenseNumber;
    capId = aa.cap.getCapID(licenseNumber).getOutput();
    var capScriptObj = aa.cap.getCap(capId);
    var capModel = (capScriptObj.getOutput()).getCapModel();
    var capSubType = '' + capModel.getCapType().getSubType();

    var legalBusinessName = '' + getAppName(capId);
    var licenseType = getLicenseType(licenseNumber, capSubType);
    var licenseStatus = getLicenseStatus('' + capModel.getCapStatus());
    var licenseValidityStart = '' + taskStatusDate('Active');
    var vLicenseObj = new licenseObject(null, capId);
    var licenseExpiration = '' + vLicenseObj.b1ExpDate;

    var vPrimary = getContactObj(capId, 'Primary Contact Person');
    var phone1 = null;
    var email = null;
    var firstName = null;
    var lastName = null;
    if(vPrimary) { //in case 'Primary Contact Person' doesn't exist. Shouldn't happen in production
        if(vPrimary.people.phone1) {
            phone1 = '' + vPrimary.people.phone1;
        }
        if(vPrimary.people.email) {
            email = '' + vPrimary.people.email;
        }
        if(vPrimary.people.firstName) {
            firstName = '' + vPrimary.people.firstName;
        }
        if(vPrimary.people.lastName) {
            lastName = '' + vPrimary.people.lastName;
        }
    }

    var vBusinesses = getContactObj(capId, 'Business');
    var phone2 = null;
    if(vBusinesses) { //in case 'Business' doesn't exist. Shouldn't happen in production
        if(vBusinesses.people.phone1) {
            phone2 = '' + vBusinesses.people.phone1;
        }
    }

    var addressModel = getAddressModel(capId);
    var premiseAddress = '' + addressModel.addressLine1;
    var premiseCity = '' + addressModel.city;
    var premiseState = '' + addressModel.state;
    var premiseZip = '' + addressModel.zip;
    var sellersPermitNumber = '' + getAppSpecific("Seller's Permit Number");

    ////////////FORMAT DATA TO JSON////////////////////////////////////////////////////
    var jsonResult = {
        "LicenseNumber": licenseNumber,
        "LicenseName": legalBusinessName,
        "LicenseType": licenseType,
        "LicenseSubtype": "N/A",
        "LicenseStatus": licenseStatus,
        "LicenseValidityStart": licenseValidityStart,
        "LicenseExpiration": licenseExpiration,
        "MobilePhoneNumber": phone1,
        "MainPhoneNumber": phone2,
        "MainEmail": email,
        "PhysicalAddress": {
            "Street1": premiseAddress,
            "Street2": null,
            "Street3": null,
            "Street4": null,
            "City": premiseCity,
            "County": null,
            "State": premiseState,
            "PostalCode": premiseZip
        },
        "ManagerFirstName": firstName,
        "ManagerMiddleName": null,
        "ManagerLastName": lastName,
        "AssessorParcelNumber" : "N/A",
        "SellersPermitNumber" : sellersPermitNumber
    };

    return jsonResult;

    /**
     * ======================= PRIVATE FUNCTIONS ===========================
     *
     * Nested functions to reduce global namespace pollution
     */

    /**
     * Returns the CAT license status based on this license status
     */
    function getLicenseStatus(licenseStatus) {
        if(licenseStatus == 'Active') { //using "evil twins" because === doesn't work in this environment, sorry Douglas
            return 'Active';
        } else  {
            return 'Inactive';
        }
    }

    /**
     * Returns the CAT license type based on license number and license Type
     */
    function getLicenseType(licenseNumber, subType) {
        var licenseType = licenseNumber.substring(0, licenseNumber.indexOf("-"));
        var firstChar = licenseNumber.substring(0, 1);
        var licenseDigits = licenseType.substring(1, licenseType.length);
        if (firstChar === 'C') {
            return 'Type '+licenseDigits + ' ' + subType;
        } else {
            return firstChar + '-Type ' + licenseDigits + ' ' + subType;
        }
    }

    /**
     * Returns the 'Business' contact 'Premise' address model. It assumes there is only one.
     */
    function getAddressModel(capId) {
        var vBusinesses = getContactObjsByCap_BCC(capId, 'Business');

        if (vBusinesses) {
            // Assume only one business contact
            vBusiness = vBusinesses[0];
            vAddresses = vBusiness.addresses;
            if (vAddresses) {
                x = 0;
                for (x in vAddresses) {
                    vAddress = vAddresses[x];
                    // Use only the Premise address type - assumes only one
                    if (vAddress.getAddressType() == "Premise") { //using "evil twins" because === doesn't work in this environment, sorry Douglas
                        return vAddress;
                    }
                }
            }
        }
    }
}

