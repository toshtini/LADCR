//ASSESS_BUS_APP_FEES_2020.09.js
// Uses business activity application drill down selections in ACA
// Last Update 09/10/20
// This relies on AInfo[] being populated with custom fields.

if (isTrue(AInfo["Are you submitting a Modification Request?"])) {
    updateFee("J098B21", "CAN_BUS_APP", "FINAL", 1, "Y"); //Cannabis Application Review Fee
}

if (!isTrue(AInfo["Is this a Renewal?"])) {
    logDebug("Not a Renewal");
    updateFee("J300", "CAN_BUS_APP", "FINAL", 1, "Y"); //Cannabis Pre-Application Review Fee
} else {
	var codeSet;
	var phase = "" + getPriority(capId);
	if ("104.07 Phase 1".equals(phase)) {
		codeSet = "00";
	}
	if ("104.08 Phase 2".equals(phase)) {
		codeSet = "20";
	}
	
	if (codeSet) {
		// Cultivation
		if (matches("CHECKED", AInfo["Adult-Use Cultivation Small Indoor"], AInfo["Medical Cultivation Small Indoor"])) {
			actFees.push("J" + codeSet + "7R21");
		}
		if (matches("CHECKED", AInfo["Adult-Use Cultivation Medium Indoor"], AInfo["Medical Cultivation Medium Indoor"])) {
			actFees.push("J" + codeSet + "8R21");
		}
		if (matches("CHECKED", AInfo["Adult-Use Cultivation Specialty Cottage Indoor"], AInfo["Medical Cultivation Specialty Cottage Indoor"])) {
			actFees.push("J" + codeSet + "5R21");
		}
		if (matches("CHECKED", AInfo["Adult-Use Cultivation Specialty Indoor"], AInfo["Medical Cultivation Specialty Indoor"])) {
			actFees.push("J" + codeSet + "6R21");
		}
		// Distributor
		if (matches("CHECKED", AInfo["Adult-Use Distributor"], AInfo["Medical Distributor"])) {
			actFees.push("J" + codeSet + "4R21");
		}
		// Manufacturer
		if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 1"], AInfo["Medical Manufacturer Level 1"])) {
			actFees.push("J" + codeSet + "9R21");
		}
		if (matches("CHECKED", AInfo["Adult-Use Manufacturer Level 2"], AInfo["Medical Manufacturer Level 2"])) {
			// no licenses!
		}
		// Delivery
		if (matches("CHECKED", AInfo["Adult-Use Delivery Only"], AInfo["Medical Delivery Only"])) {
			if (codeSet == "00") {
				actFees.push("J" + codeSet + "3R21");
			}
		}

		// Retail
		if (matches("CHECKED", AInfo["Adult-Use Retail"], AInfo["Medical Retail"])) {
			if (codeSet == "00") {
				actFees.push("J" + codeSet + "1R21");
			}
		}
		if (matches("CHECKED", AInfo["Adult-Use Microbusiness"], AInfo["Medical Microbusiness"])) {
			if (codeSet == "00") {
				actFees.push("J" + codeSet + "2R21");
			}
		}
		// Misc Y/N selections
		if (matches("Yes", AInfo["Nursery"])) {
			// no licenses!
		}
		if (matches("Yes", AInfo["Testing"])) {
			if (codeSet == "00") {
				actFees.push("J" + codeSet + "4R21");
			}
		}
		
		// add the fees
		for (var i in actFees) {
			updateFee(actFees[i],"CAN_BUS_APP","FINAL",1,"Y");
		}
	}
}

function isTrue(o) {
    return String(o) == "CHECKED" || String(o) == "YES" || String(o) == "Yes";
}
