/*------------------------------------------------------------------------------------------------------/
| Program : ACA_APP_CHECK_REFCONTACT_SOCIALELE.js
| Event   : ACA Page Flow attachments before event
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : 08/23/2019, ghess - added check for Earliest Temporary License  (Preferred Channel)
|         : 09/10/2019, ghess - included check for multiple sessions but not implementing. Added undue concentration check.
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
var useCustomScriptFile = true;  			// if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));


function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var publicUser = false ;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN" ; publicUser = true }  // ignore public users
var capIDString = capId.getCustomID();					// alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();				// Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");				// Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var parcelArea = 0;

var estValue = 0; var calcValue = 0; var feeFactor			// Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId,null).getOutput();	// Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}

var balanceDue = 0 ; var houseCount = 0; feesInvoicedTotal = 0;		// Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId);			// Detail
if (capDetailObjResult.getSuccess())
	{
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
	}

var AInfo = new Array();						// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 						// Add AppSpecific Info
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
    var pSeqNumber = publicUserID.replace("PUBLICUSER","");
    pSeqNumber = aa.util.parseInt(pSeqNumber)
    pSeqNumber = aa.util.parseLong(pSeqNumber)
    publicUserResult = aa.publicUser.getPublicUser(pSeqNumber);
    if (publicUserResult.getSuccess()) {
    	publicUser = publicUserResult.getOutput();
    }
    contrPeopleModel = getRefContactForPublicUser(pSeqNumber);
	if (contrPeopleModel != null) {
        refNum = contrPeopleModel.getContactSeqNumber();
        // test 1 social equity
        var refConResult = aa.people.getPeople(refNum);
		if (refConResult.getSuccess()) {
            var refPeopleModel = refConResult.getOutput();
			if (refPeopleModel != null) {
				var asiEarliestTemporaryLicense = refPeopleModel.getPreferredChannel();
				//if(!matches(refPeopleModel.getSalutation(),"SEP Tier 1 & 2 Eligible","SEP Tier 1 Eligible","SEP Tier 1 and Tier 2 Eligibil","SEP Tier 2 Eligible"))
				//if(!matches(refPeopleModel.getSalutation(),"SEP Tier 1 & 2 Qualified","SEP Tier 1 Qualified","SEP Tier 2 Qualified"))
				if(!matches(refPeopleModel.getSalutation(),"SEP Tier 1 & 2 Qualified","SEP Tier 1 Qualified","SEP Tier 2 Qualified")|| (aa.util.parseInt(asiEarliestTemporaryLicense) == 1))
					{
					showMessage = true;
					//comment("Unable to proceed. You are not eligible for the Social Equity Status. Your current status is " + refPeopleModel.getSalutation() + ".");
					comment("Unable to proceed. Your Social Equity Status has not been verified for this round of licensing.");
					cancel = true;
					}
			}
        }
	}
	/************************************************************** currently not in use...
	// test 2 applications in progress.  fail if any incompletes
	var sql = "select DISTINCT B1_PER_ID1, B1_PER_ID2, B1_PER_ID3 from B1PERMIT WHERE B1_APPL_CLASS = 'INCOMPLETE CAP' AND B1_CREATED_BY = '" + publicUserID + "' AND SERV_PROV_CODE= '" + aa.getServiceProviderCode() + "' AND REC_STATUS = 'A'";
	var existingRecs = doSQLQuery(sql);
	if (existingRecs && existingRecs.length > 0) {
		var existingBiz = [];
		for (var i in existingRecs) {
			aa.print(existingRecs[i].B1_PER_ID1 + " " +  existingRecs[i].B1_PER_ID2 + " " + existingRecs[i].B1_PER_ID3);
			var existingId = aa.cap.getCapID(existingRecs[i].B1_PER_ID1,existingRecs[i].B1_PER_ID2,existingRecs[i].B1_PER_ID3).getOutput();
			if (existingId) {
				var finishedCap = aa.cap.getProjectByMasterID(existingId,"EST",null).getOutput();
				// only include tmps that aren't finished
				if ((!capIDString.equals(existingId.getCustomID())) && !finishedCap) {
					existingBiz.push(existingId.getCustomID());
				}
			}
		}
		if (existingBiz.length > 0) {
			showMessage = true;
			comment("Unable to proceed. One or more applications are already in progress (" + existingBiz.join(",") + ")");
			cancel = true;				
		}
	}
	**************************************************************/
	// test 3 Only allow applications where undue concentration (9/10/2019)
	if(AInfo["Retailer Commercial Cannabis Activity license in an area of Undue Concentration?"] == "No"){
		showMessage = true;
		comment("Unable to proceed. Applicants may only submit Public Convenience or Necessity requests for Retail Storefront Commercial Cannabis Activity licenses that would be located in an Area of Undue Concentration.");
		cancel = true;
	}
	
} catch (err) {

logDebug(err)	}

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


function doSQLQuery(sql) {

	try {
		var array = [];
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);

		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			aa.print("(doSQL) executing : " + sql);
			var rSet = sStmt.executeQuery();
			while (rSet.next()) {
				var obj = {};
				var md = rSet.getMetaData();
				var columns = md.getColumnCount();
				for (i = 1; i <= columns; i++) {
					obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
				}
				obj.count = rSet.getRow();
				array.push(obj);
			}
			aa.print("(doSQL) number of rows returned : " + array.length);
			aa.print(JSON.stringify(array));
			rSet.close();
		} 

		sStmt.close();
		conn.close();
		return array;
	} catch (err) {
		aa.print(err.message);
	}
}
