//SEND_EMAIL_TO_INTERESTED_PARTIES
//created 04/05/2019, ghess
//updated 10/08/2019

function notifyByArea(pFieldName, pFieldValue, pMailFrom, pEmailTemplate, vEParamsToSend, capId4Email, partyEmailsArr){

//Gathers all contacts whose template field matches the input value
//send email to the contacts' email address
//Parameters:
//	pFieldName - name of contact template field containing area values 
//	pFieldValue - value to be searched for in template field
//	for sending email...
//		pMailFrom
//		pEmailTemplate
//		vEParamsToSend
//		capId4Email
//
//Returns contact array

try {
var testing = false;
		
	logDebug("Inside notifyByArea(): Looking for a match for " + pFieldName + " = " + pFieldValue);
	if (testing) aa.print("Inside notifyByArea(): Looking for a match for " + pFieldName + " = " + pFieldValue);

	var retNotifcations = false;
	var contactTemplFieldName = pFieldName.toUpperCase();
	var attrEmail = "";
	var attrFirstName = "";
	var attrLastName = "";
	var attrContactSeqNumber = "";
	var attrFullName= "";
	var personArr = new Array();

	//aa.print("");
		if (!pFieldValue || pFieldValue == null || pFieldValue == "") {
				logDebug("Invalid Contact template value");
				//aa.print("Invalid Contact template value");
				return retNotifcations;
			}

		peopleArr = getRefContactListByTypeAndAttribute("Individual", contactTemplFieldName, pFieldValue);
		//objectExplore1(peopleArr);
		
		if (peopleArr && peopleArr.length > 0) {
			for (cnt in peopleArr) {
			
				perString = String(peopleArr[cnt]);
				if (testing) aa.print(perString);
				personArr = perString.split(" ");
				for (attrib in personArr){
					if (testing) aa.print("personArr[" + attrib + "] = " + personArr[attrib]);

					if (personArr[attrib] == "FirstName:") attrFirstName = personArr[++attrib];
					if (personArr[attrib] == "LastName:") attrLastName = personArr[++attrib];
					if (personArr[attrib] == "email:") attrEmail = personArr[++attrib];
					if (personArr[attrib] == "ContactSeqNumber:") attrContactSeqNumber = personArr[++attrib];
					
				}
				if (testing) aa.print("attrContactSeqNumber = " + attrContactSeqNumber);
				if (testing) aa.print("attrFirstName = " + attrFirstName);
				if (testing) aa.print("attrLastName = " + attrLastName);
				if (testing) aa.print("attrEmail = " + attrEmail);
				//aa.print("");

				// check for duplicates
				var notDuplicate = true;
				for (x in partyEmailsArr) {
					if (partyEmailsArr[x] == attrEmail) {
						notDuplicate = false;
						logDebug("Duplicate email found: " + attrEmail);
						if (testing) aa.print("Duplicate email found: " + attrEmail);
					}
				}
				if (notDuplicate) {
					
					partyEmailsArr.push(attrEmail);
					//aa.print("Adding to partyEmailsArr array: " + attrEmail);
		
					//Set contact Name paramaters
					attrFullName = attrFirstName + " " + attrLastName;
					addParameter(vEParamsToSend, "$$notificationName$$", attrFullName);

					//Send email
					//aa.print("Email Sent: " + aa.document.sendEmailAndSaveAsDocument(pMailFrom, attrEmail, "", pEmailTemplate, vEParamsToSend, capId4Email, null).getSuccess());
					sendNotification(pMailFrom,attrEmail,"",pEmailTemplate,vEParamsToSend,null);
					aa.print("Email Sent: ");
					
					logDebug("     " + capId.getCustomID() + ": Sent Email template " + pEmailTemplate + " to " + attrEmail);
					if (testing) aa.print("     " + capId.getCustomID() + ": Sent Email template " + pEmailTemplate + " to " + attrEmail);
					
					retNotifcations = true;
				}
			}
		} else {
			logDebug("No contacts returned from attribute search!");
			if (testing) aa.print("No contacts returned from attribute search!");
		}

	return partyEmailsArr;
	}
catch (err) {
	logDebug("A JavaScript Error occured in function notifyByArea(): " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	}
}

function notifyIPByArea(emailTemplate) {
try{
	logDebug("1) Here in notifyIPByArea(): " + aa.env.getValue("eventType"));
	logDebug("2) emailTemplate: " + emailTemplate);

	//get From email from template configuration
	if (emailTemplate && emailTemplate != '') {
		tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
		mailFrom = tmpl.getEmailTemplateModel().getFrom();
	}
	
	var capId4Email = null;
	capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

	
	var params = aa.util.newHashtable();
	//getACARecordParam4Notification(params,acaUrl);
	addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
	addParameter(params,"$$altID$$",capIDString);
	//addParameter(params,"$$notificationName$$",ipName)

	//Start Interested Paries specific code...
	
	//Global store email addresses for duplicate checking
	var partyEmailsArr = new Array();

	//get record custom field values
	//send notice to conacts whoes template field mathces the corresponding record custom field
	
	asiFieldName = "Council District";
	contactTemplateField = "Council District";
	asiFieldValue = getAppSpecific(asiFieldName);
	aa.print("Looking for new field match for " + asiFieldName + " = " + asiFieldValue);
	aa.print("asiFieldValue = " + asiFieldValue);
	
	partyEmailsArr = notifyByArea(contactTemplateField, asiFieldValue, mailFrom, emailTemplate, params, capId4Email, partyEmailsArr);
	//aa.print("notifyResult for " + asiFieldName + " = " + notifyResult);
	
	aa.print("");
	asiFieldName = "Neighborhood Council";
	contactTemplateField = "Neighborhood Council";
	asiFieldValue = getAppSpecific(asiFieldName);
	aa.print("Looking for new field match for " + asiFieldName + " = " + asiFieldValue);
	aa.print("asiFieldValue = " + asiFieldValue);

	partyEmailsArr = notifyByArea(contactTemplateField, asiFieldValue, mailFrom, emailTemplate, params, capId4Email, partyEmailsArr);
	//aa.print("notifyResult for " + asiFieldName + " = " + notifyResult);

	aa.print("");
	asiFieldName = "Area Planning Commission";
	contactTemplateField = "Area Planning Commission";
	asiFieldValue = getAppSpecific(asiFieldName);
	aa.print("Looking for new field match for " + asiFieldName + " = " + asiFieldValue);
	aa.print("asiFieldValue = " + asiFieldValue);

	partyEmailsArr = notifyByArea(contactTemplateField, asiFieldValue, mailFrom, emailTemplate, params, capId4Email, partyEmailsArr);
	
	aa.print("");
	asiFieldName = "LAPD Area Station";
	contactTemplateField = "LAPD Area Station";
	asiFieldValue = getAppSpecific(asiFieldName);
	aa.print("Looking for new field match for " + asiFieldName + " = " + asiFieldValue);
	aa.print("asiFieldValue = " + asiFieldValue);

	partyEmailsArr = notifyByArea(contactTemplateField, asiFieldValue, mailFrom, emailTemplate, params, capId4Email, partyEmailsArr);
	
	/****************************************************
	****************************************************/



}
catch(err){
	aa.print("Error:" + err);
	//comment("Error:" + err);
}
}

try {
	showDebug = true;

	//Enter Code Here.......................
	//SEND_EMAIL_TO_INTERESTED_PARTIES
	notifyIPByList("LADCR INTERESTED PARTIES BY LIST");
	
	//
	notifyIPByArea("LADCR INTERESTED PARTIES BY AREA");	


	
	}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	}
