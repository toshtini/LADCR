//Start - License Creation/Update Script
//if (wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Provisionally Issued" || wfStatus == "Temporarily Issued"))  // modified (11/28/18)

var childSuffixArray = [];

// CREATE CHILD RECORDS HERE
var rt = ["Licenses", "Cannabis", "Business", "Application"];

if (matches("CHECKED", AInfo["Cultivation Small Indoor"], AInfo["Cultivation Medium Indoor"], AInfo["Cultivation Specialty Indoor"], AInfo["Adult-Use Cultivation Medium Indoor"], AInfo["Adult-Use Cultivation Small Indoor"], AInfo["Adult-Use Cultivation Specialty Indoor"], AInfo["Medical Cultivation Medium Indoor"], AInfo["Medical Cultivation Small Indoor"], AInfo["Medical Cultivation Specialty Indoor"])) {
    childSuffixArray.push("C");
}

if (matches("CHECKED", AInfo["Medical Manufacturer Level 2"], AInfo["Adult-Use Manufacturer Level 2"])) {
    childSuffixArray.push("V");
}

if (matches("CHECKED", AInfo["Medical Delivery Only"], AInfo["Adult-Use Delivery Only"])) {
    childSuffixArray.push("Q");
}

if (matches("CHECKED", AInfo["Distributor Transport Only"], AInfo["Adult-Use Distributor Transport Only"], AInfo["Medical Distributor Transport Only"])) {
    childSuffixArray.push("D");
}

if (matches("CHECKED", AInfo["Medical Manufacturer Level 1"], AInfo["Adult-Use Manufacturer Level 1"])) {
    childSuffixArray.push("M");
}

if (matches("CHECKED", AInfo["Medical Manufacturer Level 2"], AInfo["Adult-Use Manufacturer Level 2"])) {
    childSuffixArray.push("V");
}

if (matches("CHECKED", AInfo["Retail"], AInfo["Adult-Use Retail"], AInfo["{Medical Retail"], AInfo["{Adult-Use Microbusiness"], AInfo["{Medical Microbusiness"])) {
    childSuffixArray.push("R");
}

if (matches("CHECKED", AInfo["Testing"])) {
    childSuffixArray.push("T");
}

for (var i in childSuffixArray) {
    var childId = createChild(rt[0], rt[1], rt[2], rt[3], "");

    //Copy ASI from child to license
    // TODO: only certain fields?
    copyASIInfo(capId, childId);

    //Copy ASIT from child to license
    copyASITables(capId, childId);

    //Copy Contacts from child to license
    copyContacts3_0(capId, childId);

    //Copy Work Description from child to license
    aa.cap.copyCapWorkDesInfo(capId, childId);

    //Copy application name from child to license
    editAppName(getAppName(capId), childId);

    //use the suffix to give it a unique ID
    lacdUpdateAltID(childId, "ACTIVITY", capId.getCustomID(), childSuffixArray[i]);

    //End - Activity Record Creation/Update Script
}

// remove -R- redundant activity record

if (capId.getCustomID().indexOf("-R-") > 0) {
	logDebug("removing -R- from record Id : " + capId.getCustomID());
	var updResult = aa.cap.updateCapAltID(capId, capId.getCustomID().replace("-R-",""));
}
