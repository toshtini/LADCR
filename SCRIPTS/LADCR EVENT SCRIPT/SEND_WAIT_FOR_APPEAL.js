// Begin script to branch workflow and send denial email
if ((wfTask.equals("Final Review") && wfStatus.equals("Issuance Denied")) || 
    (wfTask.equals("DCR Community Meeting") && wfStatus.equals("Recommend Denial")) || 
    (wfTask.equals("CRC Meeting") && wfStatus.equals("Recommend Denial"))) {
    // advance workflow
    deactivateTask(wfTask);
    activateTask("Wait for Appeal");
    
    //populate contact single address fields for report
    updateContactAddressFromAddressType(capId,"Owner Applicant","Mailing");

    var vEParams = aa.util.newHashtable();
    addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
    addParameter(vEParams, "$$ApplicationID$$", capIDString);
    addParameter(vEParams, "$$businessName$$", capName);
    var vRParams = aa.util.newHashtable();
    addParameter(vRParams, "p1Value", capIDString);
    addParameter(vRParams, "p2Value", wfStatus);
    addParameter(vRParams, "p3Value", wfTask);
    emailContacts_BCC("All", "DCA OWNER APPLICANT DENIED NOTIFICATION", vEParams, "Denial of License - Appealable", vRParams);
  }
// End script to branch workflow and send denial email
