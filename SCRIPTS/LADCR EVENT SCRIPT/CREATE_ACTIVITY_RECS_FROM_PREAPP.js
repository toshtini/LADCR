//Start - License Creation/Update Script
// Update: 08/27/2020

//if (wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Provisionally Issued" || wfStatus == "Temporarily Issued"))

var childSuffixArray = [];

// CREATE CHILD RECORDS HERE
var rt = ["Licenses", "Cannabis", "Business", "Application"];

// Cultivation
if (matches("CHECKED", AInfo["Cultivation Small Indoor"], AInfo["Cultivation Medium Indoor"], AInfo["Cultivation Specialty Indoor"])) {
    childSuffixArray.push("C");
}

if (matches("CHECKED", AInfo["Adult-Use Cultivation Medium Indoor"], AInfo["Adult-Use Cultivation Small Indoor"], AInfo["Adult-Use Cultivation Specialty Indoor"], AInfo["Adult-Use Cultivation Specialty Cottage Indoor"])) {
    childSuffixArray.push("C");
}
if (matches("CHECKED", AInfo["Medical Cultivation Medium Indoor"], AInfo["Medical Cultivation Small Indoor"], AInfo["Medical Cultivation Specialty Indoor"], AInfo["Medical Cultivation Specialty Cottage Indoor"])) {
    childSuffixArray.push("C");
}

// Distributor
if (matches("CHECKED", AInfo["Distributor Transport Only"])) {
    childSuffixArray.push("D");
}
if (matches("CHECKED", AInfo["Adult-Use Distributor"], AInfo["Medical Distributor"])) {
    childSuffixArray.push("D");
}

// Manufacturer
if (matches("CHECKED", AInfo["Manufacturer"])) {
    childSuffixArray.push("V");
}
if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 1"], AInfo["Medical Manufacturer Level 1"])) {
    childSuffixArray.push("M");
}
if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 2"], AInfo["Medical Manufacturer Level 2"])) {
    childSuffixArray.push("V");
}

// Delivery
if (matches("CHECKED", AInfo["Delivery Only"])) {
    childSuffixArray.push("Q");
}
if (matches("CHECKED", Ainfo["Adult-Use Delivery Only"], AInfo["Medical Delivery Only"])) {
    childSuffixArray.push("Q");
}

// Retail
if (matches("CHECKED", AInfo["Retail"])) {
    childSuffixArray.push("R");
}
if (matches("CHECKED", AInfo["Adult-Use Retail"], AInfo["{Medical Retail"], AInfo["{Adult-Use Microbusiness"], AInfo["{Medical Microbusiness"])) {
    childSuffixArray.push("R");
}

// Misc Y/N selections
if (matches("Yes", AInfo["Distributor Transport Only"])) {
    childSuffixArray.push("T");
}
if (matches("Yes", AInfo["Nursery"])) {
    childSuffixArray.push("T");
}
if (matches("Yes", AInfo["Testing"])) {
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
