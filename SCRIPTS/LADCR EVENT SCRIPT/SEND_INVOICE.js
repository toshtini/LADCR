// Script 60

var vEParams = aa.util.newHashtable();
addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
addParameter(vEParams, "$$ApplicationID$$", capIDString);
var vRParams = aa.util.newHashtable();
addParameter(vRParams, "p1Value", capIDString);
emailContacts_BCC('Owner Applicant', "LADCR_OWNER_INVOICE", vEParams, "Invoice", vRParams,"N","LADCR Invoice");

