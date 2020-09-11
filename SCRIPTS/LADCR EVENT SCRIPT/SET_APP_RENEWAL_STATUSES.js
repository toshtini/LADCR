// SET_APP_RENEWAL_STATUSES
// Set renewal parent and child initial record statuses
// Last update: 05/13/2020
if(getAppSpecific("Is this a Renewal?") == "Yes" || getAppSpecific("Is this a Renewal?") == "Y") {
	updateAppStatus("Temporarily Approved","Initial Status",capId);
	updateAppStatus("Deprecated","Renewal Update",parentCapId);
}
