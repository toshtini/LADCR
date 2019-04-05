//SEND_EMAIL_TO_INTERESTED_PARTIES_ASYNC
//created 04/05/2019, ghess

function notifyByArea(pStdChoice, pFieldName, pMailFrom, pEmailTemplate, vEParamsToSend, capId4Email){
//Parameters:
//	pStdChoice - name of Standard Choice containing area values 
//	pFieldName - custom field name containing value to be compared against Standard Choice values
//	for sending email...
//		pMailFrom
//		pEmailTemplate
//		vEParamsToSend
//		capId4Email
//
//Returns true if contact attribute found, otherwise false
try {
		
	logDebug("Looking up interested parties for field: " + pFieldName);

	var retNotifcations = false;
	var asiFieldName = pFieldName.toUpperCase();
	var attrEmail = "";
	var attrFirstName = "";
	var attrLastName = "";
	var attrContactSeqNumber = "";
	var attrFullName= "";
	var personArr = new Array();

	
	var bizDomScriptResult = aa.bizDomain.getBizDomain(pStdChoice);
	if (!bizDomScriptResult || !bizDomScriptResult.getSuccess())
	{
		logDebug("Standard Choice '" + pStdChoice + "' not defined.");
		return false;
	}
	var bizDomScriptObj = bizDomScriptResult.getOutput();
	if (!bizDomScriptObj || bizDomScriptObj.size() == 0)
	{
		logDebug("No criteria defined in Standard Choice '" + pStdChoice + "'.");
		return false;
	}

	//aa.print("");
	for(var BDIndx = 0; BDIndx < bizDomScriptObj.size(); BDIndx++)
	{
		var standardChoiceObj = bizDomScriptObj.get(BDIndx);
		//objectExplore1(standardChoiceObj);
		var standardChoiceValue = standardChoiceObj.getDispBizdomainValue();
		if (!standardChoiceValue || standardChoiceValue == "")
			continue;
		//aa.print("standardChoiceValue = " + standardChoiceValue);

		peopleArr = getRefContactListByTypeAndAttribute("Individual", asiFieldName, standardChoiceValue);
		//objectExplore1(peopleArr);
		
		if (peopleArr && peopleArr.length > 0) {
			for (cnt in peopleArr) {
			
				perString = String(peopleArr[cnt]);
				//aa.print(perString);
				personArr = perString.split(" ");
				for (attrib in personArr){
					////aa.print("personArr[" + attrib + "] = " + personArr[attrib]);

					if (personArr[attrib] == "FirstName:") attrFirstName = personArr[++attrib];
					if (personArr[attrib] == "LastName:") attrLastName = personArr[++attrib];
					if (personArr[attrib] == "email:") attrEmail = personArr[++attrib];
					if (personArr[attrib] == "ContactSeqNumber:") attrContactSeqNumber = personArr[++attrib];
					
				}
				//aa.print("attrContactSeqNumber = " + attrContactSeqNumber);
				//aa.print("attrFirstName = " + attrFirstName);
				//aa.print("attrLastName = " + attrLastName);
				//aa.print("attrEmail = " + attrEmail);
				//aa.print("");

				// check for duplicates
				var notDuplicate = true;
				for (x in partyEmailsArr) {
					if (partyEmailsArr[x] == attrEmail) {
						notDuplicate = false;
						aa.print("Duplicate email found: " + attrEmail);
					}
				}
				if (notDuplicate) {
					
					partyEmailsArr.push(attrEmail);
					//aa.print("Adding to partyEmailsArr array: " + attrEmail);
		
					//Set contact Name paramaters
					attrFullName = attrFirstName + " " + attrLastName;
					//addParameter(vEParamsToSend, "$$FullNameBusName$$", attrFullName);
									
					//Send email
					pMailFrom = "dcrinterestedparty@lacity.org";

					aa.print("Email Sent: " + aa.document.sendEmailAndSaveAsDocument(pMailFrom, attrEmail, "", pEmailTemplate, vEParamsToSend, capId4Email, null).getSuccess());
					aa.print("     " + capId.getCustomID() + ": Sent Email template " + pEmailTemplate + " to " + attrEmail);
					
					retNotifcations = true;
				}
			}
		}
		//break; //for debugging
	}

	return retNotifcations;
	}
catch (err) {
	logDebug("A JavaScript Error occured in function notifyByArea(): " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	}
}

aa.print("1) Here in sendEmailToInterestedPartiesASync: " + aa.env.getValue("eventType"));

//Example: call from function emailContacts_BCC(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {

//Get environmental variables pass into the script
/***************************************************/
var emailTemplate = aa.env.getValue("emailTemplate");
var vEParams = aa.env.getValue("vEParams");
var reportTemplate = aa.env.getValue("reportTemplate");
var vRParams = aa.env.getValue("vRParams");
var vChangeReportName = aa.env.getValue("vChangeReportName");
var capId = aa.env.getValue("CapId");
/****************************************************/

/**** for testing *********
var emailTemplate = "DCA OWNER APPLICANT FEES DUE NOTIFICATION";	//aa.env.getValue("emailTemplate");
var vEParams = aa.util.newHashtable();								//aa.env.getValue("vEParams");
var reportTemplate = "";											//aa.env.getValue("reportTemplate");
var vRParams = "";													//aa.env.getValue("vRParams");
var vChangeReportName = "";											//aa.env.getValue("vChangeReportName");
//var capId = getCapId();											//aa.env.getValue("CapId");
***** end set for testing ****/

aa.print("2) emailTemplate: " + emailTemplate);
aa.print("3) reportTemplate: " + reportTemplate);

//Set variables used in the script
var tmpl;
var mailFrom;
var capId4Email;
var vReportName;
var vDocumentList;
var vDocumentModel;
var vDocumentName;
var vACAUrl;
var vEParamsToSend = vEParams;
var stdChoice = "";
var asiFieldName = "";

//Start modification to support batch script, if not batch then grab globals, if batch do not.
if (aa.env.getValue("eventType") != "Batch Process") {
	/* Begin Code needed to call master script functions ---------------------------------------------------*/
	function getScriptText(vScriptName, servProvCode, useProductScripts) {
		if (!servProvCode)
			servProvCode = aa.getServiceProviderCode();
		vScriptName = vScriptName.toUpperCase();
		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
		try {
			if (useProductScripts) {
				var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
			} else {
				var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
			}
			return emseScript.getScriptText() + "";
		} catch (err) {
			return "";
		}
	}
	var SCRIPT_VERSION = 3.0;
	aa.env.setValue("CurrentUserID", "ADMIN");
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
	eval(getScriptText("INCLUDES_CUSTOM", null, true));	
}
else {
	var balanceDue;
	var capDetailObjResult = aa.cap.getCapDetail(capId);		
	if (capDetailObjResult.getSuccess())
	{
		capDetail = capDetailObjResult.getOutput();
		balanceDue = capDetail.getBalance();
	}
}
/* End Code needed to call master script functions -----------------------------------------------------*/

	/* --------- For testing --------------
	capIdStr = "LA-C-19-000048-APP";
	
	//aa.print("Current Record Id: " + capIdStr);
	var ltresult = aa.cap.getCapID(capIdStr);
	 if (ltresult.getSuccess())
  		capId = ltresult.getOutput();
	 ------------------------------------ */

logDebug("1) Here in SEND_EMAIL_TO_INTERESTED_PARTIES_ASYNC: " + aa.env.getValue("eventType"));
logDebug("2) emailTemplate: " + emailTemplate);
logDebug("3) reportTemplate: " + reportTemplate);

/* Begin SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */

if (reportTemplate == "Payment Reminder" && balanceDue == '0') {
	logDebug("Cancelling sendEmailToInterestedPartiesASync. Report is a Payment Reminder and balanceDue is 0.")
}
else {
	logDebug("5) balanceDue: " + balanceDue);
/* End SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */


	//get From email from template configuration
	if (emailTemplate && emailTemplate != '') {
		tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
		mailFrom = tmpl.getEmailTemplateModel().getFrom();
	}
	
	//Get the capId type needed for the email function
	////aa.print("capId for email = " + capId);
	capId4Email = null;
	capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

	//Get ACA Url
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));

	//Generate report and get report name THIS IS DUBIOUS...
	vReportName = false;
	if (reportTemplate != '' && reportTemplate != null) {
		//generate and get report file
		vReportName = generateReportForEmail_BCC(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);

		//update the report name if one was provided. this will be used to update the saved report's name
		if (vReportName != false && vChangeReportName != null && vChangeReportName != "") {
			logDebug("Renaming generated report document name from " + vReportName + " to " + vChangeReportName);
			if (editDocumentName(vReportName, vChangeReportName) == true) {
				vReportName = vChangeReportName;
			}
		}
	}

	//Get document deep link URL
	if (vReportName != null && vReportName != false) {
		vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
		if (vDocumentList != null) {
			vDocumentList = vDocumentList.getOutput();
		}
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			if (vDocumentName == vReportName) {
				//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(vEParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				//aa.print("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				break;
			}
		}
	}

	//Start Interested Paries specific code...
	
	//Global store email addresses for duplicate checking
	var partyEmailsArr = new Array();

	stdChoice = "Council Districts";
	asiFieldName = "Council District";
	
	var notifyResult = notifyByArea(stdChoice, asiFieldName, mailFrom, emailTemplate, vEParamsToSend, capId4Email);
	////aa.print("notifyResult for " + asiFieldName + " = " + notifyResult);
	
	stdChoice = "Neighborhood Councils";
	asiFieldName = "Neighborhood Council";

	var notifyResult = notifyByArea(stdChoice, asiFieldName, mailFrom, emailTemplate, vEParamsToSend, capId4Email);
	////aa.print("notifyResult for " + asiFieldName + " = " + notifyResult);

	/****************************************************
	stdChoice = "Area Planning Commission";
	asiFieldName = "Area Planning Commission";

	var notifyResult = notifyByArea(stdChoice, asiFieldName);
	//aa.print("notifyResult for " + asiFieldName + " = " + notifyResult);
	
	stdChoice = "Community Police Stations";
	asiFieldName = "Police Department Area";
	
	****************************************************/
		

/* Begin SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */	
}
/* End SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */
