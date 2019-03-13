//COPY_PUBLIC_USER_TO_AGENT_OF_SERVICE.js
if (publicUser) {
	try {
		// get the public user account
		var FacAndPinOK = false;
		var contactAddedFac = false;
		var contactAddedChild = false;
		var getUserResult = aa.publicUser.getPublicUserByPUser(publicUserID);

		if (getUserResult.getSuccess() && getUserResult.getOutput()) {
			userModel = getUserResult.getOutput();
			userSeqNum = userModel.getUserSeqNum();
			refContact = getRefContactForPublicUser(userSeqNum)
				if (refContact != null) {
					refContactNum = refContact.getContactSeqNumber();
					addRefContactToRecord(refContactNum, "Agent of Service", capId);
				} //if (refContact != null)

		} //if (getUserResult.getSuccess() && getUserResult.getOutput())

	} //try
	catch (err) {
		aa.print("A JavaScript Error occurred: " + err.message);
	}
}
