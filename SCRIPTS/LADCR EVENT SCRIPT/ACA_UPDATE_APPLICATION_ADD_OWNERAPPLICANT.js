	
	
if(publicUser)
{
	var publicUserID = aa.env.getValue("CurrentUserID");
    var pSeqNumber = publicUserID.replace("PUBLICUSER","");  
    pSeqNumber = aa.util.parseInt(pSeqNumber)
    pSeqNumber = aa.util.parseLong(pSeqNumber)
    publicUserResult = aa.publicUser.getPublicUser(pSeqNumber);
    if (publicUserResult.getSuccess()) {
    	publicUser = publicUserResult.getOutput();
    }
    contrPeopleModel = getRefContactForPublicUser(pSeqNumber);
	if (contrPeopleModel != null) {
        refNum = contrPeopleModel.getContactSeqNumber();
        var refConResult = aa.people.getPeople(refNum);
		if (refConResult.getSuccess()) {
            var refPeopleModel = refConResult.getOutput();
			if (refPeopleModel != null) {
				// Get Reference Contact Attributes associated to the current public user
				var refFName = refPeopleModel.getFirstName()
				var refMName = refPeopleModel.getMiddleName()
				var refLName = refPeopleModel.getLastName()
				var refEmail = refPeopleModel.getEmail()
				var refPhone1 = refPeopleModel.getPhone1()
				var refPhone2 = refPeopleModel.getPhone2()
				var refPhone3 = refPeopleModel.getPhone3()
				
				// Create Transactional Contact from Reference Contact 
				var pModel = aa.people.createPeopleModel().getOutput().getPeopleModel();
				pModel.setFullName(refFName + " " + refLName);
				pModel.setFirstName(refFName)
				pModel.setMiddleName(refMName)
				pModel.setLastName(refLName)
				pModel.setServiceProviderCode(servProvCode );  
				pModel.setContactType("Owner Applicant");
				pModel.setEmail(refEmail);
				pModel.setPhone1(refPhone1);
				pModel.setPhone2(refPhone2);
				pModel.setPhone3(refPhone3);
				pModel.setContactSeqNumber(pSeqNumber); 
				var capContactModel = new com.accela.aa.aamain.people.CapContactModel();
				//var capContactModel = new aa.people.CapContactModel();
				capContactModel.setPeople(pModel);
				capContactModel.setCapID(capId);
				logDebug(aa.people.createCapContactWithAttribute(capContactModel));
			}
		}
	}
}