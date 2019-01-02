function scheduleMeeting(mtgDateTime, mtgType, numDays) {
	// schedule meeting looking X number of days out from mtgDateTime
    try{
        var itemCap = capId; 
        if (arguments.length == 4) itemCap = arguments[3]; // use cap ID specified in args
        var reqDateTime = ""+ mtgDateTime;
        var reqDate = reqDateTime.substring(0,10);
        var reqTime = reqDateTime.substr(13,5);
        var fromDate = dateAdd(reqDate,0);
        var toDate = dateAdd(reqDate,parseInt(numDays));
        var dFromDate = aa.date.parseDate(fromDate);
        var dToDate = aa.date.parseDate(toDate);

        var meetingResults = aa.meeting.getAvailableMeetings(null, 0, null, dFromDate, dToDate, null, null );
        if(meetingResults.getSuccess()){
            meetingResultsArr = meetingResults.getOutput();
        }else{
            logDebug("No Meetings for the date requested: " +mtgDate);
        }
        if(meetingResultsArr != null && meetingResultsArr.length > 0){
            logDebug("Found " + meetingResultsArr.length + " meetings ");
            meetingResultsArr.sort(compareMeetingDateDesc);
            mtgObj = meetingResultsArr[0];
            for(meetingItem in meetingResultsArr){
                var mtgObj = meetingResultsArr[meetingItem];  //MeetingModel
                var mtgObjType = ""+mtgObj.getMeetingType();
                if(mtgObjType == mtgType.toUpperCase()){
                    var mtgEventID = mtgObj.getMeetingId();
                }
                if(mtgEventID == null){
                    logDebug("No available " + mtgType + " meeting found." );
                    return false;
                }
                else{
                    var mtgGroupId = mtgObj.getMeetingGroupId();
                    scheduledResult = aa.meeting.scheduleMeeting(itemCap, mtgGroupId, mtgEventID, "0", "", "");
                    if(scheduledResult.getSuccess()){
                        comment("Meeting successfully scheduled for " + mtgObj.getStartDate());
                        break;
                    }else{
                        logDebug("Failed to schedule meeting.  Please manually schedule the meeting.");
                    }
                }
            }
        }else{
        	logDebug("No Meetings found");
        }

    }catch (err) {
        logDebug("A JavaScript Error occurred:  scheduleMeeting: " + err.message);
        logDebug(err.stack);
    }
}