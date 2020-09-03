//Start - License Creation/Update Script
//Update: 08/31/2020:12:53AM

//if (wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Provisionally Issued" || wfStatus == "Temporarily Issued"))

var childSuffixArray = [];
var clearASIArray = [];

// CREATE CHILD RECORDS HERE
var rt = ["Licenses", "Cannabis", "Business", "Application"];

var aList = ["Adult-Use Cultivation Medium Indoor",
    "Adult-Use Cultivation Small Indoor",
    "Adult-Use Cultivation Specialty Cottage Indoor",
    "Adult-Use Cultivation Specialty Indoor",
    "Adult-Use Distributor",
    "Adult-Use Manufacturer Level 1",
    "Adult-Use Manufacturer Level 2",
    "Adult-Use Retail",
    "Adult-Use Microbusiness",
    "Adult-Use Delivery Only",
    "Medical Cultivation Medium Indoor",
    "Medical Cultivation Small Indoor",
    "Medical Cultivation Specialty Cottage Indoor",
    "Medical Cultivation Specialty Indoor",
    "Medical Distributor",
    "Medical Manufacturer Level 1",
    "Medical Manufacturer Level 2",
    "Medical Retail",
    "Medical Microbusiness",
    "Medical Delivery Only",
    "Distributor Transport Only",
    "Testing",
    "Nursery"];

// Cultivation
if (matches("CHECKED", AInfo["Cultivation Small Indoor"], AInfo["Cultivation Medium Indoor"], AInfo["Cultivation Specialty Indoor"])) {
    childSuffixArray.push("C");
    clearASIArray["C"] = removeElements(aList.slice(), ["Cultivation Small Indoor", "Cultivation Medium Indoor", "Cultivation Specialty Indoor"]);
} else {

    if (matches("CHECKED", AInfo["Adult-Use Cultivation Medium Indoor"], AInfo["Adult-Use Cultivation Small Indoor"], AInfo["Adult-Use Cultivation Specialty Indoor"], AInfo["Adult-Use Cultivation Specialty Cottage Indoor"])) {
        childSuffixArray.push("C");
        clearASIArray["C"] = removeElements(aList.slice(), ["Adult-Use Cultivation Medium Indoor", "Adult-Use Cultivation Small Indoor", "Adult-Use Cultivation Specialty Indoor", "Adult-Use Cultivation Specialty Cottage Indoor"]);
    } else {
        if (matches("CHECKED", AInfo["Medical Cultivation Medium Indoor"], AInfo["Medical Cultivation Small Indoor"], AInfo["Medical Cultivation Specialty Indoor"], AInfo["Medical Cultivation Specialty Cottage Indoor"])) {
            childSuffixArray.push("C");
            clearASIArray["C"] = removeElements(aList.slice(), ["Medical Cultivation Medium Indoor", "Medical Cultivation Small Indoor", "Medical Cultivation Specialty Indoor", "Medical Cultivation Specialty Cottage Indoor"]);
        }
    }
}

// Distributor
if (matches("CHECKED", AInfo["Distributor"])) {
    childSuffixArray.push("D");
    clearASIArray["D"] = removeElements(aList.slice(), ["Distributor"]);
} else {
    if (matches("CHECKED", AInfo["Adult-Use Distributor"], AInfo["Medical Distributor"])) {
        childSuffixArray.push("D");
        clearASIArray["D"] = removeElements(aList.slice(), ["Adult-Use Distributor", "Medical Distributor"]);
    } else {
        if (matches("Yes", AInfo["Distributor Transport Only"])) {
            childSuffixArray.push("D");
            clearASIArray["D"] = removeElements(aList.slice(), ["Distributor Transport Only"]);
        }
    }
}

// Manufacturer
if (matches("CHECKED", AInfo["Manufacturer"])) {
    childSuffixArray.push("V");
    clearASIArray["V"] = removeElements(aList.slice(), ["Manufacturer"]);
} else {
    if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 2"], AInfo["Medical Manufacturer Level 2"])) {
        childSuffixArray.push("V");
        clearASIArray["V"] = removeElements(aList.slice(), ["Adult-Use Manufacturer Level 2", "Medical Manufacturer Level 2"]);
    } else {
        if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 1"], AInfo["Medical Manufacturer Level 1"])) {
            childSuffixArray.push("M");
            clearASIArray["V"] = removeElements(aList.slice(), ["Adult-Use Manufacturer Level 1", "Medical Manufacturer Level 1"]);
        }
    }
}

// Delivery
if (matches("CHECKED", AInfo["Delivery Only"])) {
    childSuffixArray.push("Q");
    clearASIArray["Q"] = removeElements(aList.slice(), ["Delivery Only"]);
} else {
    if (matches("CHECKED", AInfo["Adult-Use Delivery Only"], AInfo["Medical Delivery Only"])) {
        childSuffixArray.push("Q");
        clearASIArray["Q"] = removeElements(aList.slice(), ["Adult-Use Delivery Only", "Medical Delivery Only"]);
    }
}

// Retail
if (matches("CHECKED", AInfo["Retail"])) {
    childSuffixArray.push("R");
    clearASIArray["R"] = removeElements(aList.slice(), ["Retail"]);
} else {
    if (matches("CHECKED", AInfo["Adult-Use Retail"], AInfo["Medical Retail"], AInfo["Adult-Use Microbusiness"], AInfo["Medical Microbusiness"])) {
        childSuffixArray.push("R");
        clearASIArray["R"] = removeElements(aList.slice(), ["Adult-Use Retail", "Medical Retail", "Adult-Use Microbusiness", "Medical Microbusiness"]);
    }
}

// Misc Y/N selections
if (matches("Yes", AInfo["Nursery"])) {
    childSuffixArray.push("N");
    clearASIArray["N"] = removeElements(aList.slice(), ["Nursery"]);

}
if (matches("Yes", AInfo["Testing"])) {
    childSuffixArray.push("T");
    clearASIArray["T"] = removeElements(aList.slice(), ["Testing"]);

}

for (var i in childSuffixArray) {
    var childId = createChild(rt[0], rt[1], rt[2], rt[3], "");

    //Copy ASI from child to license
    // TODO: only certain fields?
    //copyASIInfo(capId, childId);

    //Copy ASIT from child to license
    copyASITables(capId, childId);

    editAppSpecific("Is this a Renewal?", "N", childId);

    //Copy Contacts from child to license
    copyContacts3_0(capId, childId);

    //Copy Work Description from child to license
    aa.cap.copyCapWorkDesInfo(capId, childId);

    //Copy application name from child to license
    editAppName(getAppName(capId), childId);

    //use the suffix to give it a unique ID
    lacdUpdateAltID(childId, "ACTIVITY", capId.getCustomID(), childSuffixArray[i]);

    // clear ASI
    logDebug("here in record for " + childSuffixArray[i]);
    for (var j in clearASIArray[childSuffixArray[i]]) {
        logDebug("clearing ASI: " + clearASIArray[childSuffixArray[i]][j]);
        editAppSpecific(clearASIArray[childSuffixArray[i]][j], "", childId);
    }

    //End - Activity Record Creation/Update Script
}

// remove -R- redundant activity record

if (capId.getCustomID().indexOf("-R-") > 0) {
    logDebug("removing -R- from record Id : " + capId.getCustomID());
    var updResult = aa.cap.updateCapAltID(capId, capId.getCustomID().replace("-R-", "-"));
}

function removeElements(array, elem) {
    for (var i in elem) {
        var index = array.indexOf(elem[i]);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    return array;
}
