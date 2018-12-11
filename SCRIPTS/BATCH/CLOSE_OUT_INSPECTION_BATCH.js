/*------------------------------------------------------------------------------------------------------/
| Program: Close_Out_Inspection_Batch
|
| Version 1.0 - Base Version.
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var debugText = "";
var showDebug = true;
var showMessage = false;
var message = "";
var maxSeconds = 4.5 * 60;
var br = "<br>";
var currentUserID = "ADMIN";
var debug = "";
var reviewTask = "Initial Review";
var supervisorReviewTask = "Supervisory Review";
var deficiencyStatus = "Additional Info Requested";
var abandonStatus = "Abandoned";
curDate = new Date();

SCRIPT_VERSION = 3.0
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();

batchJobResult = aa.batchJob.getJobID()
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;

eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("INCLUDES_CUSTOM_GLOBALS"));


function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

function getMasterScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
	return emseScript.getScriptText() + "";
}

batchJobID = 0;
if (batchJobResult.getSuccess())
  {
  batchJobID = batchJobResult.getOutput();
  logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
  }
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());


/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
// Standard Choice PARAMETERS
/*----------------------------------------------------------------------------------------------------/
| Standard Choice : Data Extract for Assessors Office
|- lookBehindDays "30"
/------------------------------------------------------------------------------------------------------*/
/*
Standard Choice Variables
*/
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var useAppSpecificGroupName = false;
var showDebug = true;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var today = new Date();
var startTime = today.getTime();
today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0);
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
logDebug("Start of Job");
logDebug("current Date: " + curDate);
mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (showDebug) {
	aa.print(debug);
	aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(),"", emailText ,batchJobID);
}
//aa.print(emailText);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/
function mainProcess(t) {
	var capCount = 0;
	var appList = new Array();
  var permitType = "Cannabis";
	var taskName = "Pre-Inspection Review";
	var taskStatus = "Inspection Not Passed";
	var modCount = 0;

	logDebug("Retrieving permit type of Cannibus that is in Pre-Inspection and Inspection Not Passed");
	logDebug("********************************");

  var appListResult = aa.cap.getCaps(permitType, taskName, taskStatus, null);
	if (appListResult.getSuccess()) {
		appList = appListResult.getOutput();
	}
	else {
		logDebug("ERROR: Getting Applications, reason is: " + appListResult.getErrorType() + ":" + appListResult.getErrorMessage());
		return false;
	}

	if (appList.length > 0) {
		logDebug("Processing " + appList.length + " application records");
	} else {
		logDebug("No applications returned");
		return false;
	}

	logDebug("********************************");
  /*------------------------------------------------------------------------------------------------------/
  |  Loop through the list of applications
  /------------------------------------------------------------------------------------------------------*/
  for (al in appList) {
    capId = aa.cap.getCapID(appList[al].getCapID().getID1(),appList[al].getCapID().getID2(),appList[al].getCapID().getID3()).getOutput();
    capIDString = capId.getCustomID();
    logDebug(capIDString);

		//var tsiWaitDays = Get the Waiting Period number of days for the close out Inspection.
		tsiWaitDays = getTaskSpecific("Pre-Inspection Review", "Waiting Period");
	  logDebug("tsiWaitDays Field:" + tsiWaitDays);
    getDaysApart();
    logDebug("daysApart:  " + daysApart);
    if (daysApart >  tsiWaitDays) {
       closeTask("Pre-Inspection Review", "Inspection Timeout - No Activity", "", "");
			 modCount++;
		}
  }
	logDebug("Records Modified " + modCount);
}
  function getDaysApart() {
  // Find the number of days different from the current date to the status date. Close the review
  // workflow status if the number of days exceeds the or is equal to the customer supplied lookBehindDays

  //get workflow status date and change it for the startDate 2018/01/06 format yyyy/mm/dd
	  tDateString = taskStatusDate("Pre-Inspection Review", null, capId);
		logDebug("tDateString " + tDateString);
	  var tDateStr = new Date(tDateString);
		logDebug("Second tDateStr " + tDateStr);
		var mm = tDateStr.getMonth() + 1;
    var dd = tDateStr.getDate();
    var yyyy = tDateStr.getFullYear();
    if (dd < 10) {
       dd = '0' + dd;
    }
    if (mm < 10) {
       mm = '0' + mm;
    }
    var tDateStr =  yyyy + "/" + mm + "/" + dd;

	logDebug("tDateStr " + tDateStr);

  //Establish start and end dates
	var startDate = new Date(tDateStr);
  var endDate = new Date();

  logDebug("Start Date " + startDate);
  logDebug("end Date " + endDate);

  // compute one day in milliseconds
  days = 1000 * 60 * 60 * 24;  // one day in milliseconds

  //Calculate both dates to setMilliseconds
  startDate_ms = startDate.getTime();
  endDate_ms = endDate.getTime();

  //Calculate the difference in setMilliseconds

  difference_ms = endDate_ms - startDate_ms;

  //Convert back to days and return

  return daysApart = (Math.floor(difference_ms/days));
  }
