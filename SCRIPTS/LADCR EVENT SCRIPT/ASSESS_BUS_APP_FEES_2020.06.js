//ASSESS_BUS_APP_FEES_2020.06.js
// Uses business activity application drill down selections in ACA
// Last Update 05/20/20
// This relies on AInfo[] being populated with custom fields.

if (!isTrue(AInfo["Is this a Renewal?"])) {
	logDebug("Not a Renewal");
   
	if(isTrue(AInfo["Retailer Commercial Cannabis Activity license in an area of Undue Concentration?"])) {
		updateFee("J097","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Public Convenience or Necessity Application 
	} else {
	
		if (isTrue(AInfo["Delivery Only"])) {
			updateFee("J303","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Phase 3 Delivery Application Fee 
		}
		if (isTrue(AInfo["Distributor"])) {
			updateFee("J304","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Phase 3 Distributor/Transport Only Application Fee 
		}
		if (isTrue(AInfo["Manufacturer"])) {
			updateFee("J309","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Phase 3 Non-Volatile Manufacturer Application Fee 
		}

		if (String(AInfo["Use"]) == "Distribution Only") {
			updateFee("J304","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Phase 3 Distributor/Transport Only Application Fee 
		}
		if (String(AInfo["Use"]) == "Testing") {
			updateFee("J340","CAN_BUS_APP","FINAL",1,"Y"); //Cannabis Phase 3 Testing Application Fee 
		}
		
		updateFee("F100","CAN_BUS_APP","FINAL",1,"Y"); //Fire Cannabis Inspection Fee 

	}

}

function isTrue(o) {
	return String(o) == "CHECKED" || String(o) == "YES" || String(o) == "Yes";
}
