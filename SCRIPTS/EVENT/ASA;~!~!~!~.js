//RSA:*/*/*/*
//showDebug = true;
//showMessage = true;
//cancel = true;

	//update ACA Reference Id
	// get email from registered user
	var publicUserModel = aa.env.getValue("PublicUserModel");

	if (publicUserModel != null) {
		var peopleList = publicUserModel.getPeoples();
		var peopleModel = null;

		if (peopleList != null && peopleList.size() > 0) {
			var it = peopleList.iterator();
			while (it.hasNext()) {
				peopleModel = it.next();

				var regEmail = peopleModel.getEmail();

				if (regEmail) {

					//Find matching emails in reference contacts and update
					var publicUser = aa.publicUser.getPublicUserModel();

					var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
					qryPeople.setEmail(regEmail);
					var r = aa.people.getPeopleByPeopleModel(qryPeople);
					
					if (!r.getSuccess())  { 
						logDebug("WARNING: error searching for people : " + r.getErrorMessage()); 
						//return false; 
					}

					var peopResult = r.getOutput();
					
					if (peopResult.length > 0)
					{
						logDebug("Searched for REF Contacts: " + peopResult.length + " matches found! Processing contacts...");
						for (var rc in peopResult){
							//editContactFlg = false;
							contactSeqNum = peopResult[rc].getContactSeqNumber();
							logDebug("contactSeqNum = " + contactSeqNum);
							
							refContactObj = peopResult[rc].getPeopleModel();

							// update ACA Ref Id
							logDebug("Updating ACA Reference ID field with: " + contactSeqNum);
							refContactObj.setBirthCity(contactSeqNum);
							var updateReferenceContactResult = aa.people.editPeople(refContactObj);
						}
					}
				}
			}
		}
	}
