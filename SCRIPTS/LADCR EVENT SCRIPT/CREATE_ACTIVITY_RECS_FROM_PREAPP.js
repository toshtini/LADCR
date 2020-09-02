//Start - License Creation/Update Script
//Update: 08/31/2020:12:53AM

//if (wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Provisionally Issued" || wfStatus == "Temporarily Issued"))

var childSuffixArray = [];
var clearASIArray = [];

// CREATE CHILD RECORDS HERE
var rt = ["Licenses", "Cannabis", "Business", "Application"];

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index >= 0)
        this.splice(index, 1);
    return this;
};

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
    clearASIArray["C"] = aList.slice().remove("Cultivation Small Indoor").remove("Cultivation Medium Indoor").remove("Cultivation Specialty Indoor");
} else {

    if (matches("CHECKED", AInfo["Adult-Use Cultivation Medium Indoor"], AInfo["Adult-Use Cultivation Small Indoor"], AInfo["Adult-Use Cultivation Specialty Indoor"], AInfo["Adult-Use Cultivation Specialty Cottage Indoor"])) {
        childSuffixArray.push("C");
        clearASIArray["C"] = aList.slice().remove("Adult-Use Cultivation Medium Indoor").remove("Adult-Use Cultivation Small Indoor").remove("Adult-Use Cultivation Specialty Indoor"),
        remove("Adult-Use Cultivation Specialty Cottage Indoor");
    } else {
        if (matches("CHECKED", AInfo["Medical Cultivation Medium Indoor"], AInfo["Medical Cultivation Small Indoor"], AInfo["Medical Cultivation Specialty Indoor"], AInfo["Medical Cultivation Specialty Cottage Indoor"])) {
            childSuffixArray.push("C");
            clearASIArray["C"] = aList.slice().remove("Medical Cultivation Medium Indoor").remove("Medical Cultivation Small Indoor").remove("Medical Cultivation Specialty Indoor"),
            remove("Medical Cultivation Specialty Cottage Indoor");
        }
    }
}

// Distributor
if (matches("CHECKED", AInfo["Distributor"])) {
    childSuffixArray.push("D");
    clearASIArray["D"] = aList.slice().remove("Distributor");
} else {
    if (matches("CHECKED", AInfo["Adult-Use Distributor"], AInfo["Medical Distributor"])) {
        childSuffixArray.push("D");
        clearASIArray["D"] = aList.slice().remove("Adult-Use Distributor").remove("Medical Distributor");
    } else {
        if (matches("Yes", AInfo["Distributor Transport Only"])) {
            childSuffixArray.push("D");
            clearASIArray["D"] = aList.slice().remove("Distributor Transport Only");
        }
    }
}

// Manufacturer
if (matches("CHECKED", AInfo["Manufacturer"])) {
    childSuffixArray.push("V");
    clearASIArray["V"] = aList.slice().remove("Manufacturer");
} else {
    if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 2"], AInfo["Medical Manufacturer Level 2"])) {
        childSuffixArray.push("V");
        clearASIArray["V"] = aList.slice().remove("Adult-Use Manufacturer Level 2").remove("Medical Manufacturer Level 2");
    } else {
        if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 1"], AInfo["Medical Manufacturer Level 1"])) {
            childSuffixArray.push("M");
            clearASIArray["V"] = aList.slice().remove("Adult-Use Manufacturer Level 1").remove("Medical Manufacturer Level 1");
        }
    }
}

// Delivery
if (matches("CHECKED", AInfo["Delivery Only"])) {
    childSuffixArray.push("Q");
	clearASIArray["Q"] = aList.slice().remove("Delivery Only");
} else {
    if (matches("CHECKED", AInfo["Adult-Use Delivery Only"], AInfo["Medical Delivery Only"])) {
        childSuffixArray.push("Q");
		clearASIArray["Q"] = aList.slice().remove("Adult-Use Delivery Only").remove("Medical Delivery Only");
    }
}

// Retail
if (matches("CHECKED", AInfo["Retail"])) {
    childSuffixArray.push("R");
	clearASIArray["R"] = aList.slice().remove("Retail");
} else {
    if (matches("CHECKED", AInfo["Adult-Use Retail"], AInfo["Medical Retail"], AInfo["Adult-Use Microbusiness"], AInfo["Medical Microbusiness"])) {
        childSuffixArray.push("R");
		clearASIArray["R"] = aList.slice().remove("Adult-Use Retail").remove("Medical Retail").remove("Adult-Use Microbusiness").remove("Medical Microbusiness");
    }
}

// Misc Y/N selections
if (matches("Yes", AInfo["Nursery"])) {
    childSuffixArray.push("N");
	clearASIArray["N"] = aList.slice().remove("Nursery");

}
if (matches("Yes", AInfo["Testing"])) {
    childSuffixArray.push("T");
	clearASIArray["T"] = aList.slice().remove("Testing");

}

for (var i in childSuffixArray) {
    var childId = createChild(rt[0], rt[1], rt[2], rt[3], "");

    //Copy ASI from child to license
    // TODO: only certain fields?
    copyASIInfo(capId, childId);

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
	for (var j in clearASIArray[i]) {
		editAppSpecific(clearASIArray[i][j],"",childId);
	}

    //End - Activity Record Creation/Update Script
}

// remove -R- redundant activity record

if (capId.getCustomID().indexOf("-R-") > 0) {
    logDebug("removing -R- from record Id : " + capId.getCustomID());
    var updResult = aa.cap.updateCapAltID(capId, capId.getCustomID().replace("-R-", "-"));
}

function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}
