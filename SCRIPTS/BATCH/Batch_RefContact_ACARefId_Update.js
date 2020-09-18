// Batch_RefContact_ACARefId_Update.js
// Update reference contact's ACA Reference ID (Birth City) with seq num for display in ACA.
// created: 01/22/2020

/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var vEmailTemplate = "LADCR LOCAL AUTHORIZATION NOTICE";
var vReportTemplate = "Local Authorization Notification";
var rtf = ["Licenses", null, null, "Application"];
var vGoodStatuses = ["Awaiting Owner Submittals,Awaiting Data Entry"];
var contactString = "Owner Applicant,Business Owner,Business,Primary Contact Person";

var showMessage = false; // Set to true to see results in popup window
var disableTokens = false;
var showDebug = true; // Set to true to see debug messages in email confirmation
var maxSeconds = 4 * 60; // number of seconds allowed for batch processing, usually < 5*60
var autoInvoiceFees = "Y"; // whether or not to invoice the fees added
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = true; // Use Group name when populating Task Specific Info Values
var currentUserID = "ADMIN";
var publicUser = null;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var GLOBAL_VERSION = 2.0
var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");

var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag
var feeSeqList = new Array(); // invoicing fee list
var paymentPeriodList = new Array(); // invoicing pay periods
var bSetCreated = false; //Don't create a set until we find our first app
var setId = "";
var timeExpired = false;
var emailText = "";
var capId = null;
var cap = null;
var capIDString = "";
var appTypeResult = null;
var appTypeString = "";
var appTypeArray = new Array();
var capName = null;
var capStatus = null;
var fileDateObj = null;
var fileDate = null;
var fileDateYYYYMMDD = null;
var parcelArea = 0;
var estValue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var balanceDue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var capDetail = "";
var AInfo = new Array();
var partialCap = false;
var SCRIPT_VERSION = 2.0

	var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//Needed HERE to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//
// Your variables go here
// Ex. var appGroup = getParam("Group");
//
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|-----------------------------------------------------------------------------------------------------+/
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
// Your script goes here
// Ex. var appGroup = getParam("Group");
//
try {

	aa.print("Ref Contact Seq | Contact Type Flag | Contact Type | New Type" + 
	" | Organization Name | DBA Name | FEIN" +
	" | First Name | Last Name | Title |");

	var updateContacts = false;
	var contactTypeFlag = "individual";
	processRefContactContactType(contactTypeFlag, updateContacts);

	contactTypeFlag = "organization";
	processRefContactContactType(contactTypeFlag, updateContacts);
	

} catch (e) {
	logDebug(e);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage)
		aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug)
		aa.env.setValue("ScriptReturnMessage", debug);
}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/
function processRefContactContactType(pContactTypeFlag, pUpdate)
{
//pUdate: true = update contact type
	
try{
	var editContactFlg = false;
	
	var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();

	//objectExplore1(qryPeople);

	qryPeople.setContactTypeFlag(pContactTypeFlag);
	//qryPeople.setServiceProviderCode("LADCR");
	
	var r = aa.people.getPeopleByPeopleModel(qryPeople);
	
	if (!r.getSuccess())  { 
		logDebug("WARNING: error searching for people : " + r.getErrorMessage()); 
		//return false; 
	}

	var peopResult = r.getOutput();
	
	
	if (peopResult.length > 0)
	{
		logDebug("Searched for REF Contacts of flag type: " + pContactTypeFlag + ". " + peopResult.length + " matches found! Processing contacts...");
		for (var rc in peopResult){
			editContactFlg = false;
			contactSeqNum = peopResult[rc].getContactSeqNumber();
			
			//if (contactSeqNum != "317060488" ) continue; //TESTING!!!!!!!!!!!!!!!!!
			
			refContactObj = peopResult[rc].getPeopleModel();

			// update ACA Ref Id
			logDebug("Updating ACA Reference ID field with: " + contactSeqNum);
			refContactObj.setBirthCity(contactSeqNum);
			var updateReferenceContactResult = aa.people.editPeople(refContactObj);
			
		}
	}
}
catch(err){
	aa.print("Error:" + err);
	//comment("Error:" + err);
}
}

function objectExplore1(pObject)
{
try{

//	for (x in pObject)
//	{
//		logDebug("objectExplore[" + x + "] = " + pObject[x]);
//	}
	
	aa.print("Methods:")
	for (x in pObject) {
		if (typeof(pObject[x]) == "function") aa.print("   " + x);
	}

	aa.print("");
	aa.print("Properties:")
	for (x in pObject) {
		if (typeof(pObject[x]) != "function") aa.print("   " + x + " = " + pObject[x]);
	}
}
catch(err){
	aa.print("Error:" + err);
	//comment("Error:" + err);
}
}
