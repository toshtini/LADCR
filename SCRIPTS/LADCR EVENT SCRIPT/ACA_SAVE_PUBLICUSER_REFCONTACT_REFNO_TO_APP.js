var getUserResult = aa.publicUser.getPublicUserByPUser(publicUserID);
if (getUserResult.getSuccess() && getUserResult.getOutput()) {
    userModel = getUserResult.getOutput();
    userSeqNum = userModel.getUserSeqNum();
    refContact = getRefContactForPublicUser(userSeqNum)
        if (refContact != null) {
            refContactNum = refContact.getContactSeqNumber();
            editAppSpecific("Social Equity Applicants Reference Contact ID",refContactNum)
        }
}
