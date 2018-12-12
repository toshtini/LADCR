/*------------------------------------------------------------------------------------------------------/
| Program: PAY_FEES_TIME_OUT_Batch
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

overRide = "function logDebug(dstr) { aa.print(dstr); } function logMessage(dstr) { aa.print(dstr); }";
eval(overRide); 


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
function mainProcess() {
	var capCount = 0;
	var appList = new Array();
  var permitType = "Cannabis";
	var taskName = "Application Acceptance";
	var taskStatus = "Submitted";
	var businessDays = 10;
	var modCount = 0;

	logDebug("Retrieving permit type of Cannibus that is in Application Acceptance");
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


		lastPaymentDate = getLastPaymentDate(capId);
		if (lastPaymentDate) {
				logDebug("LastPaymentDate = " + lastPaymentDate);
		}
		else {
			logDebug("No payments on the record");
			// use current date, if the status date is more than 10 days difference than abandoned
			lastPaymentDate = dateAdd(null, 0); 
		}
		tDateString = taskStatusDate("Application Acceptance", null, capId);
		var tDateStr = new Date(tDateString);
		daysDiff = workDaysBetween(tDateStr, lastPaymentDate, ['AGENCY WORKDAY'], ["WEEKEND", "HOLIDAY"]);
    if (daysDiff >  businessDays) {
       closeTask("Application Acceptance", "Abandoned", "", "");
			 modCount++;
		}
  }
	logDebug("Records Modified " + modCount);
}



function getDaysApart(latestPaymentDate) {
  // Find the number of days different from the latestPaymentDate to the status date. Close the Application Accepted task with a
  // workflow status of "Abandonded". if the number of days exceeds the or is equal to the 10

  //get workflow status date and change it for the startDate 2018/01/06 format yyyy/mm/dd
	  tDateString = taskStatusDate("Application Acceptance", null, capId);
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
function getLastPaymentDate(capId) {

	    var latestPaymentDate = null;
	    var payment = aa.finance.getPaymentByCapID(capId, null);
	    if (!payment.getSuccess()) {
	        throw payment.getErrorMessage();
	    }

			var payment = payment.getOutput();
			for (var i = 0; i < payment.length; i++) {
				  var paymentModel = payment[i];
			    var paymentDate = paymentModel.getPaymentDate();
					if (!latestPaymentDate) {
	            latestPaymentDate = paymentDate;
	        } else if (latestPaymentDate.getEpochMilliseconds() < paymentDate.getEpochMilliseconds()) {
	            latestPaymentDate = paymentDate;
	        }
	    }
				    return latestPaymentDate;
}


/*===========================================================================================================
Example use:
								workingDays = workDaysAdd('01/01/2016','01/01/2017',['WORKDAY CALENDAR'],['WEEKEND','HOLIDAY']);
								
	This relies on the calendar used being configured in AA Classic
=========================================== */
function workDaysBetween(sDate,eDate,aCal,aDayEx){
	// sDate == Start Date
	// eDays == End Date
	// aCal == Array of calendars to include.
	// aDayEx == Array of day types that you wish to exclude.
	
	// Any weekend could be a three day weekend
	// 3 days are added for every weekend to make sure that we cover enough for the jump.
	// aDays2 = aDays + ((aDays / 7)*3) + 7 // this should sufficiently protect the day jumps
	
	// Variables
	var dArray = []; // to store the dates between the two dates.
	var sDate2 = convertDateBetter(sDate);
	var eDate2 = convertDateBetter(eDate);
	
	aDays2 = dayDiff(sDate2,eDate2);
	
	// Change everything in aCal to upper for comparison.
	toUpper = function(x){ 
										return x.toUpperCase();
	};
	aCal = aCal.map(toUpper);
	
	// eDate2 needs to be sufficiently into the future for the rest of the function.
	eDate2.setDate(eDate2.getDate() + aDays2);
	
	// will be used to pull sufficient days that are "off"
	var monthsBetween = monthDiff(sDate2,eDate2);

	// Now create an array of dates adding one day to each date.
	for(a = 1; a<= aDays2; a++){
									calcDate = new Date(sDate);
									calcDate.setDate(calcDate.getDate() + a);
									dArray.push(jsDateToASIDate(calcDate));
	}

	// Now look up the calendars that are going to be excluded.
	// expected return is the calendar ID's
	calNames = aa.calendar.getCalendarNames().getOutput();
	//logDebug("Found " + calNames.length + " calendars");
	for(x in calNames){
									// IF the name of the calendar is included in the list we need the
									// events from that calendar
									if(exists(calNames[x].getCalendarName().toUpperCase(),aCal)){
																	for(a = 0; a <= monthsBetween; a++){
																									calE = aa.calendar.getEventSeriesByCalendarID(calNames[x].getCalendarID(),sDate2.getFullYear(),sDate2.getMonth()+a).getOutput();
																									for(b in calE){
																																	// Get the event details
																																	var evtDateDate = new Date(convertDateBetter(calE[b].getStartDate()));
																																	var evtType = calE[b].getEventType();
																																	// Now do the COMPARISON
																																	if(exists(evtType,aDayEx) && exists(jsDateToASIDate(evtDateDate),dArray))
																																	{
																																									removeA(dArray,jsDateToASIDate(evtDateDate));
																																	}
																									}
																	}
									}
	}
	if(sDate2 == eDate2){
									return 0;
	} else {
	return dArray.length // Return the Date that can be used as a working day.
	}
}

function removeA(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax= arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

function dayDiff(first, second) {
	return Math.round((second-first)/(1000*60*60*24));
}

function monthDiff(startDate, endDate) { //
	var months;
// convert to a date
startDate = convertDateBetter(startDate);
endDate = convertDateBetter(endDate);
// calculate the number of years between thet dates so that this can be added.
	months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
// calculate based on the month
	months -= startDate.getMonth();
	months += endDate.getMonth();
// subtract a month if endDate day of month is not greater than startDate day of month.
if(endDate.getDate() < startDate.getDate()){
	months -= 1;
}
	return months <= 0 ? 0 : months;
}


function convertDateBetter(thisDate)
	{
	if (typeof(thisDate) == "string")
		{
		var retVal = new Date(String(thisDate));
		if (!retVal.toString().equals("Invalid Date"))
			return retVal;
		}
	if (typeof(thisDate)== "object")
		{
		if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
			{
			return thisDate;
			}
		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime"))
			{
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
			}
		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime"))
			{
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
			}			
		if (thisDate.getClass().toString().equals("class java.util.Date")
			|| thisDate.getClass().toString().equals("class java.sql.Timestamp")
		)
			{
			return new Date(thisDate.getTime());
			}
		if (thisDate.getClass().toString().equals("class java.lang.String"))
			{
			return new Date(String(thisDate));
			}
		}
	if (typeof(thisDate) == "number")
		{
		return new Date(thisDate);  // assume milliseconds
		}
	logDebug("**WARNING** convertDateBetter cannot parse date : " + thisDate);
	return null;
	}
