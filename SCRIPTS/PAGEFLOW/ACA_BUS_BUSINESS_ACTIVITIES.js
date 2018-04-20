/*------------------------------------------------------------------------------------------------------/
| Program : ACA_MICR_BUSINESS_ACTIVITIES.js
| Event   : ACA Page Flow Before Button
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

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
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

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

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
	var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
	currentUserID = "ADMIN";
	publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
	if (currentUserGroupObj)
		currentUserGroup = currentUserGroupObj.getGroupName();
	var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var parcelArea = 0;

var estValue = 0;
var calcValue = 0;
var feeFactor // Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput(); // Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
}

var balanceDue = 0;
var houseCount = 0;
feesInvoicedTotal = 0; // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
if (capDetailObjResult.getSuccess()) {
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
}

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
loadASITables();

logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
logDebug("capId = " + capId.getClass());
logDebug("cap = " + cap.getClass());
logDebug("currentUserID = " + currentUserID);
logDebug("currentUserGroup = " + currentUserGroup);
logDebug("systemUserObj = " + systemUserObj.getClass());
logDebug("appTypeString = " + appTypeString);
logDebug("capName = " + capName);
logDebug("capStatus = " + capStatus);
logDebug("sysDate = " + sysDate.getClass());
logDebug("sysDateMMDDYYYY = " + sysDateMMDDYYYY);
logDebug("parcelArea = " + parcelArea);
logDebug("estValue = " + estValue);
logDebug("calcValue = " + calcValue);
logDebug("feeFactor = " + feeFactor);

logDebug("houseCount = " + houseCount);
logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
logDebug("balanceDue = " + balanceDue);

// page flow custom code begin
try {
	//cancel = true;
	//showDebug = true;
	//showMessage = true;

	// Check business activities

	var isGood = false;
	var msg = "";
	for (var i in AInfo) {
		if ((i.indexOf("Medical") >= 0) || (i.indexOf("Adult-Use") >= 0) || (i.indexOf("Testing")) >= 0) {
			if (AInfo[i] && AInfo[i].equalsIgnoreCase("CHECKED")) {
				isGood = true;
				break;
			}
		}
		if (i.equals("Testing") && AInfo[i].equalsIgnoreCase("YES")) {
			isGood = true;
			break;
		}
	}

	if (!isGood) {
		msg = "You must select at least 1 activity to continue.";
	} else {
		// test logic on activities
		var v = {};

		var acFields = ["Adult Use", "Adult-Use Cultivation Medium Indoor", "Adult-Use Cultivation Small Indoor", "Adult-Use Cultivation Specialty Cottage Indoor", "Adult-Use Cultivation Specialty Indoor", "Adult-Use Distributor", "Adult-Use Distributor Transport Only", "Adult-Use Manufacturer Level 1", "Adult-Use Retail", "Adult-Use Microbusiness", "Adult-Use Delivery Only", "Medical Use", "Medical Cultivation Medium Indoor", "Medical Cultivation Small Indoor", "Medical Cultivation Specialty Cottage Indoor", "Medical Cultivation Specialty Indoor", "Medical Distributor", "Medical Distributor Transport Only", "Medical Manufacturer Level 1", "Medical Retail", "Medical Microbusiness", "Medical Delivery Only"];
		var acTypes = ["Adult Use", "Medical Use", "Testing"];

		v.a = AInfo["Adult Use"];
		v.A = {};
		v.A.CMI = AInfo["Adult-Use Cultivation Medium Indoor"];
		v.A.CSI = AInfo["Adult-Use Cultivation Small Indoor"];
		v.A.CSC = AInfo["Adult-Use Cultivation Specialty Cottage Indoor"];
		v.A.CSP = AInfo["Adult-Use Cultivation Specialty Indoor"];
		v.A.D = AInfo["Adult-Use Distributor"];
		v.A.DTO = AInfo["Adult-Use Distributor Transport Only"];
		v.A.M1 = AInfo["Adult-Use Manufacturer Level 1"];
		v.A.R = AInfo["Adult-Use Retail"];
		v.A.M = AInfo["Adult-Use Microbusiness"];
		v.A.DO = AInfo["Adult-Use Delivery Only"];
		v.m = AInfo["Medical Use"];
		v.M = {};
		v.M.CMI = AInfo["Medical Cultivation Medium Indoor"];
		v.M.CSI = AInfo["Medical Cultivation Small Indoor"];
		v.M.CSC = AInfo["Medical Cultivation Specialty Cottage Indoor"];
		v.M.CSP = AInfo["Medical Cultivation Specialty Indoor"];
		v.M.D = AInfo["Medical Distributor"];
		v.M.DTO = AInfo["Medical Distributor Transport Only"];
		v.M.M1 = AInfo["Medical Manufacturer Level 1"];
		v.M.R = AInfo["Medical Retail"];
		v.M.M = AInfo["Medical Microbusiness"];
		v.M.DO = AInfo["Medical Delivery Only"];
		v.t = AInfo["Testing"];

		if ((isTrue(v.t) && (isTrue(v.a) || isTrue(v.m))) || numberOfTrue(v.A.CMI, v.A.CSI, v.A.CSC, v.A.CSP) > 1 || numberOfTrue(v.M.CMI, v.M.CSI, v.M.CSC, v.M.CSP) > 1 || numberOfTrue(v.A.D, v.A.DTO) > 1 || numberOfTrue(v.M.D, v.M.DTO) > 1 || numberOfTrue(v.A.R, v.A.M, v.A.DO) > 1 || numberOfTrue(v.A.R, v.A.M, v.A.DO) > 1) {
			isGood = false;
			msg = "Invalid selections, please select items slowly.  Resetting..."
				for (var i in acFields) {
					editAppSpecific4ACA(acFields[i], "UNCHECKED");
				}
				for (var i in acTypes) {
					editAppSpecific4ACA(acTypes[i], "NO");
				}
		}

	}
	if (!isGood) {
		cancel = true;
		showMessage = true;
		comment(msg);
		aa.env.setValue("CapModel", cap);
	}
}
catch (err) {
	handleError(err);
}
// page flow custom code end


if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	}
}

function numberOfTrue() {
	var c = 0;
	for (var i = 0; i <= arguments.length; i++) {
		if (isTrue(arguments[i]))
			c++;
	}
	return c;
}

function isTrue(o) {
	return o == "CHECKED" || o == "YES" || o == "Yes";
}
