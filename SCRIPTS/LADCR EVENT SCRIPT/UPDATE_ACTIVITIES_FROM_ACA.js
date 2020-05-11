// This updates the original business activity application selections with the new ones used for drill down in ACA
// Last Update 03/20/20
// This relies on AInfo[] being populated with custom fields.

if (!isTrue(AInfo["Is this a Renewal?"])) {
	logDebug("Not a Renewal");
	// reset all fields
	editAppSpecific("Adult-Use Cultivation Medium Indoor", "UNCHECKED");
	editAppSpecific("Adult-Use Cultivation Small Indoor", "UNCHECKED");
	editAppSpecific("Adult-Use Cultivation Specialty Indoor", "UNCHECKED");
	editAppSpecific("Adult-Use Delivery Only", "UNCHECKED");
	editAppSpecific("Adult-Use Distributor Transport Only", "UNCHECKED");
	editAppSpecific("Adult-Use Distributor", "UNCHECKED");
	editAppSpecific("Adult-Use Manufacturer Level 1", "UNCHECKED");
	editAppSpecific("Adult-Use Retail", "UNCHECKED");
	editAppSpecific("Medical Cultivation Medium Indoor", "UNCHECKED");
	editAppSpecific("Medical Cultivation Small Indoor", "UNCHECKED");
	editAppSpecific("Medical Cultivation Specialty Indoor", "UNCHECKED");
	editAppSpecific("Medical Delivery Only", "UNCHECKED");
	editAppSpecific("Medical Distributor Transport Only", "UNCHECKED");
	editAppSpecific("Medical Distributor", "UNCHECKED");
	editAppSpecific("Medical Manufacturer Level 1", "UNCHECKED");
	editAppSpecific("Medical Retail", "UNCHECKED");
	editAppSpecific("Testing","N");
   
  	if (String(AInfo["Use"]) == "Adult" ||  String(AInfo["Use"]) == "Adult and Medical") {
		logDebug("adult");
	    if (isTrue(AInfo["Retail"])) {
			editAppSpecific("Adult-Use Retail", "CHECKED");
			logDebug("retail");
	    }
	    if (isTrue(AInfo["Manufacturer"])) {
			editAppSpecific("Adult-Use Manufacturer Level 1", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Small Indoor"])) {
			editAppSpecific("Adult-Use Cultivation Small Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Medium Indoor"])) {
			editAppSpecific("Adult-Use Cultivation Medium Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Specialty Indoor"])) {
			editAppSpecific("Adult-Use Cultivation Specialty Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Delivery Only"])) {
			editAppSpecific("Adult-Use Delivery Only", "CHECKED");
	    }
	    if (isTrue(AInfo["Distribution Transport Only"])) {
			editAppSpecific("Adult-Use Distributor Transport Only", "CHECKED");
	    }
	    if (isTrue(AInfo["Distributor"])) {
			editAppSpecific("Adult-Use Distributor", "CHECKED");
	    }
	}
 
  	if (String(AInfo["Use"]) == "Medical" ||  String(AInfo["Use"]) == "Adult and Medical") {
	    if (isTrue(AInfo["Retail"])) {
			editAppSpecific("Medical Retail", "CHECKED");
	    }
	    if (isTrue(AInfo["Manufacturer"])) {
			editAppSpecific("Medical Manufacturer Level 1", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Small Indoor"])) {
			editAppSpecific("Medical Cultivation Small Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Medium Indoor"])) {
			editAppSpecific("Medical Cultivation Medium Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Cultivation Specialty Indoor"])) {
			editAppSpecific("Medical Cultivation Specialty Indoor", "CHECKED");
	    }
	    if (isTrue(AInfo["Delivery Only"])) {
			editAppSpecific("Medical Delivery Only", "CHECKED");
	    }
	    if (isTrue(AInfo["Distribution Transport Only"])) {
			editAppSpecific("Medical Distributor Transport Only", "CHECKED");
	    }
	    if (isTrue(AInfo["Distributor"])) {
			editAppSpecific("Medical Distributor", "CHECKED");
	    }
	}
  
  	if (String(AInfo["Use"]) == "Testing") {
		editAppSpecific("Testing","Y");
	}
}
function isTrue(o) {
	return String(o) == "CHECKED" || String(o) == "YES" || String(o) == "Yes";
}
