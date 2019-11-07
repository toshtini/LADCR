/*******************************************************
| Script Title: One_Time_Batch_Update_Zimas.js   
| Created by: John Schomp
| Created on: 9/11/2019
| Modified by: ()
*********************************************************/


/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var disableTokens = false;
var showDebug = true; // Set to true to see debug messages in email confirmation
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

var addressURL = "http://zimas.lacity.org/zmaWS-DCR/zmaService.svc/GetZIMASAddress?";
var dataURL = "http://zimas.lacity.org/zmaWS-1.0/zmaService.svc/GetZIMASDataByPINAndAPN?"
	var dataCount = 0;
try {
	var vCapList = aa.cap.getByAppType("Licenses", "Cannabis", "Business", "Application").getOutput();
	logDebug("Looping through " + vCapList.length + " records");
	var responseArray = [];
	for (var x in vCapList) {
		// limiter
		if (dataCount > 5) {
			break;
		}
		var response = {};

		vCap = vCapList[x];
		capId = vCap.getCapID();
		altId = capId.getCustomID();
		//		appTypeAlias = vCap.getCapModel().getAppTypeAlias();
		//		vLicenseObj = new licenseObject(null, capId);

		if (!matches(altId.substr(0, 8), "LA-C-19-", "LA-P-19")) {
			logDebug(altId + " not a valid record");
			continue;
		}

		logDebug(altId + " processing...");
		response.altId = String(altId);
		var params = [];
		/*
		1.	HseNum
		2.	StrNm
		3.	StrDir = Street Direction; e.g. N, S, E, W
		4.	StrSfx = Street Suffix
		5.	HseFrc  = House Fraction; e.g. #/#
		6.	StrSfxDir = Street Suffix Direction; e,g, NORTH, SOUTH, EAST, WEST
		 */

		var add = aa.address.getAddressByCapId(capId).getOutput();
		if (add && add.length > 0) {
			var theAdd = add[0];
			if (theAdd.getHouseNumberStart())
				params.push("HseNum=" + theAdd.getHouseNumberStart());
			if (theAdd.getStreetName()) {
				var sn = theAdd.getStreetName().toUpperCase();
				sn = sn.replace(" BLVD", "");
				sn = sn.replace(" ST", "");
				sn = sn.replace(" AVE", "");
				sn = sn.replace(" AVENUE", "");
				sn = sn.replace(" STREET", "");
				params.push("StrNm=" + sn);
			}
			if (theAdd.getStreetSuffixdirection())
				params.push("StrDir=" + theAdd.getStreetSuffixdirection());
			/*if (theAdd.getStreetSuffix())
			params.push("StrSfx=" + theAdd.getStreetSuffix());
			 */
		}

		if (params.length == 0) {
			logDebug(altId + " no address data, skipping");
			continue;
		}

		var theUrl = encodeURI(addressURL + params.join("&"));
		response.url = String(theUrl);

		var vOutObj = aa.httpClient.get(theUrl);

		if (vOutObj.getSuccess()) {
			var vOut = vOutObj.getOutput();
			//  aa.print(vOut);
			// not sure if we need this JSON.parse, getOutput might do this already
			var vOutParsed = JSON.parse(vOut);
			logDebug("returned " + vOutParsed.length + " results");
			response.addressResults = String(vOutParsed.length);
		}
		responseArray.push(response);
		dataCount++;

		// only get ZIMAS data if we have a known good address
		if (vOutParsed.length == 1) {
			theUrl = encodeURI(dataURL + "PIN=" + String(vOutParsed[0].PIN));
			response.dataurl = String(theUrl);

			var vOutObj = aa.httpClient.get(theUrl);

			if (vOutObj.getSuccess()) {
				var vOut = vOutObj.getOutput();
				var vOutParsed = JSON.parse(vOut);
				if (vOutParsed.length > 0) {
					logDebug("we have data");
					//var addrData = vOutParsed[0].Value.ZIMASDataTabs[0];
					var jurisData = vOutParsed[0].Value.ZIMASDataTabs[1];
					var zoningData = vOutParsed[0].Value.ZIMASDataTabs[2];
					var econoData = vOutParsed[0].Value.ZIMASDataTabs[8];
					var safetyData = vOutParsed[0].Value.ZIMASDataTabs[10];
					for (var i in jurisData.Value) {
						if ("Community Plan Area".equals(jurisData.Value[i].Description)) {
							response["Community Plan Area"] = jurisData.Value[i].Value;
						}
						if ("Council District".equals(jurisData.Value[i].Description)) {
							response["Council District"] = jurisData.Value[i].Value;
						}
						if ("Neighborhood Council".equals(jurisData.Value[i].Description)) {
							response["Neighborhood Council"] = jurisData.Value[i].Value;
						}
						if ("Area Planning Commission".equals(jurisData.Value[i].Description)) {
							response["Area Planning Commission"] = jurisData.Value[i].Value;
						}						
					}
					var zone = [];
					for (var i in zoningData.Value) {

						if ("CPIO: Community Plan Imp. Overlay".equals(zoningData.Value[i].Description)) {
							response["Overlay Zone"] = zoningData.Value[i].Value;
						}
						if ("Specific Plan Area".equals(zoningData.Value[i].Description)) {
							response["Specific Plan Area"] = zoningData.Value[i].Value;
						}
						if ("Zoning".equals(zoningData.Value[i].Description)) {
							zone.push(zoningData.Value[i].Value);
						}
					}
					response["Zoning"] = zone.join(",");
					for (var i in econoData.Value) {

						if ("Business Improvement District".equals(econoData.Value[i].Description)) {
							response["Business Improvement District"] = econoData.Value[i].Value;
						}
					}
					for (var i in safetyData.Value) {
						if (safetyData.Value[i].Description.indexOf("Division / Station") >= 0) {
							response["LAPD Area Station"] = safetyData.Value[i].Value;
						}
						if (safetyData.Value[i].Description.indexOf("District / Fire Station") >= 0) {
							response["LAFD Fire Station"] = safetyData.Value[i].Value;
						}


					}
				}

			}

		}
	}

	logDebug(JSON.stringify(responseArray));

} catch (e) {
	logDebug("Error: " + e);
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