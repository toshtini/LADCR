
var vEParams = aa.util.newHashtable();
addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
addParameter(vEParams, "$$ExpirationDate$$", dateAdd(null, 60));
addParameter(vEParams, "$$ApplicationID$$", capIDString);
addParameter(vEParams, "$$businessName$$", capName);
addParameter(vEParams, "$$todaysDate$$", dateAdd(null,0));
addParameter(vEParams, "$$address$$", getAddressInALine());
emailContacts_BCC("All", "LADCR NOTICE OF APPLICATION ABANDONMENT", vEParams, "", "");

