/*------------------------------------------------------------------------------------------------------/
| Program: LADCR CORRESPONDENCE FROM SET.js  Trigger: Batch
| Client:
|
| REQUIRED: CORRESPONDENCE SCRIPT PARAMS std choice
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Initialize Variables
/------------------------------------------------------------------------------------------------------*/
/* START SCRIPT TEST PARAMETERS */
/*
aa.env.setValue("setName","SCHOMP");
aa.env.setValue("emailTemplate","BLAST NOTICE PHASE 2 LETTER 02");
aa.env.setValue("sendEmailToContactTypes","Individual");
aa.env.setValue("reportName","");
//aa.env.setValue("eventType","Batch Process");
*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;
var sysDate = aa.date.getCurrentDate();
var batchJobResult = aa.batchJob.getJobID();
var batchJobName = "" + aa.env.getValue("BatchJobName");
var batchJobID = 0;
var capId;

SCRIPT_VERSION = 3.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,true));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM",null,true));

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
if (!servProvCode) 
	servProvCode = aa.getServiceProviderCode();

vScriptName = vScriptName.toUpperCase();
var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
try
 {
	if (useProductScripts) {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
	}	

	else {
		var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	}
	
	return emseScript.getScriptText() + "";
 }

catch (err) {
return "";
}
}
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var setName = getJobParam("setName");  // use this standard choice for parameters instead of batch jobs
var emailTemplate = getJobParam("emailTemplate"); // use this expiration field instead of b1expiration
var sendEmailToContactTypes = getJobParam("sendEmailToContactTypes"); // use this expiration group instead of b1expiration
var reportTemplate = getJobParam("reportTemplate");


if (batchJobResult.getSuccess()) {
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
	logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

if (setName && setName != "") { 
	var setMemberArray = new Array();
	var setMemberResult = aa.set.getCAPSetMembersByPK(setName);
	if (setMemberResult.getSuccess()) {
		setMemberArray = setMemberResult.getOutput().toArray();
		aa.env.setValue("SetMemberArray", setMemberArray);
	} else {
		aa.print("Error: Could not find set by PK: " + setName);
	}

	aa.env.setValue("CurrentUserID", "ADMIN");
}



/* END SCRIPT TEST PARAMETERS */

var debug = "";
var br = "<br>";
var message = "";
var emailText = "";
var AInfo = []; // editTaskSpecific needs this defined as global
var useAppSpecificGroupName = ""; // getAppSpecific needs this defined as global
var currentUserID = aa.env.getValue("CurrentUserID");
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var SetMemberArray = aa.env.getValue("SetMemberArray");
var sysFromEmail = "dcrlicensing@lacity.org";


/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
/*----------------------------------------------------------------------------------------------------/
|
| Start: SCRIPT PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

logDebug("=====Processing set " + setName);

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var startDate = new Date();
var startTime = startDate.getTime();			// Start timer

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("*** Start of Job ***");

if (emailTemplate && emailTemplate != "" && sendEmailToContactTypes && sendEmailToContactTypes != "" && SetMemberArray.length > 0) {
	mainProcess();

} else {
	logDebug("*** WARNING** : This set has no records. ***");
}

logDebug("*** End of Job: Elapsed Time : " + elapsed() + " Seconds ***");

aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", debug + message);
	
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	resultObjArray = new Array();
	var resultObjArray = aa.env.getValue("SetMemberArray");
	for (curRecord in resultObjArray) {
		capId = resultObjArray[curRecord];
		aa.env.setValue("PermitId1", resultObjArray[curRecord].getID1());
		aa.env.setValue("PermitId2", resultObjArray[curRecord].getID2());
		aa.env.setValue("PermitId3", resultObjArray[curRecord].getID3());
		var capIdObject = getCapId();

		var cap = aa.cap.getCap(capId).getOutput();
		var altId = capIdObject.getCustomID();

		logDebug("=====Identifying record " + altId);

		/*
		//Generate license report and email
		var vRParams = aa.util.newHashtable();
		addParameter(vRParams, "p1Value", capId.getCustomID());
		*/
		var vEParams = aa.util.newHashtable();		
		if (sendEmailToContactTypes.length > 0 && emailTemplate.length > 0) {
			eParams = aa.util.newHashtable();
			rParams = aa.util.newHashtable();
			addParameter(rParams, "p1Value", altId);
			//sendNotification(sysFromEmail,conEmail,"",emailTemplate,eParams, [],capId);
			emailContacts_BCC(sendEmailToContactTypes, emailTemplate, eParams, reportTemplate, rParams)
		}
	}	
}

function getJobParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret;
	if (aa.env.getValue("paramStdChoice") != "") {
		var b = aa.bizDomain.getBizDomainByValue(aa.env.getValue("paramStdChoice"),pParamName);
		if (b.getSuccess()) {
			ret = b.getOutput().getDescription();
			}	

		ret = ret ? "" + ret : "";   // convert to String
		
		logDebug("Parameter (from std choice " + aa.env.getValue("paramStdChoice") + ") : " + pParamName + " = " + ret);
		}
	else {
			ret = "" + aa.env.getValue(pParamName);
			logDebug("Parameter (from batch job) : " + pParamName + " = " + ret);
		}
	return ret;
}
