//SEND_APPEAL_PETITION_FEE_NOTICE
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
	emailContacts_BCC("All", "LADCR_APPEAL_PETITION_FEES_DUE_NOTIFICATION", vEParams, "Invoice - Appeal", vRParams);
