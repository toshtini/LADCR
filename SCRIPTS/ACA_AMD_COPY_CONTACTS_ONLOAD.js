/*------------------------------------------------------------------------------------------------------/
| Program : ACA_AMD_COPY_CONTACTS_ONLOAD.js
| Event   : ACA ONLOAD (CONTACT PORTLET)
|
| Usage   : Used to pre-populate contacts on amendment records from the amendment parent.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : 02/23/2015 ETW - added setComponentName(null), fix for contacts not displaying in ACA
|
/------------------------------------------------------------------------------------------------------*/


var cap = aa.env.getValue("CapModel");
parentCapIdString = "" + cap.getParentCapID();
if (parentCapIdString) {
	pca = parentCapIdString .split("-");
	parentCapId = aa.cap.getCapID(pca[0],pca[1],pca[2]).getOutput();
}

if (parentCapId) {
	//Get the non-Applicant contacts
	parentCap =aa.cap.getCapViewBySingle4ACA(parentCapId);
	contactList = parentCap.getContactsGroup();
	for (i = 0; i < contactList.size(); i++) {
		contactList.get(i).getPeople().setContactSeqNumber(null);
		contactList.get(i).setComponentName(null);
	}
	cap.setContactsGroup(contactList);
	
	//Get the applicant
	applicantModel = parentCap.getApplicantModel();
	applicantModel.getPeople().setContactSeqNumber(null);
	applicantModel.setComponentName(null);
	cap.setApplicantModel(applicantModel);

	aa.env.setValue("CapModel",cap);
}

