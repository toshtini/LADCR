//SEND_APPEAL_FEES_DUE
capIDString = capId.getCustomID();
cap = aa.cap.getCap(capId).getOutput();
capTypeAlias = cap.getCapType().getAlias();

//get parent id
var parentId = getParent();

//set email and report parameters
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	
	var vRParams = aa.util.newHashtable();
	addParameter(vRParams, "p1Value", capIDString);

//Send to contacts on parent application record
	//emailContacts_BCC('Business Owner', "LADCR_OWNER_INVOICE", vEParams, "Invoice", vRParams, 'N', '', parentId);
	emailContacts_BCC("All", "LADCR APPEAL FEES DUE", vEParams, "Invoice - Appeal", vRParams);
