function workDaysAdd(sDate,aDays,aCal,aDayEx){
	//Parameters : 
	//	sDate == Start Date
//		aDays == Days to add in number of "workingDays"
//		aCal == Array of calendars to exclude dates from.
//		aDayEx == Array of day types that you wish to exclude.
//
//	Example use:
//		nextDate = workDaysAdd(Date(),tBdDay[0],['WORKDAY CALENDAR'],['WEEKEND','HOLIDAY']);
	
	// Any weekend could be a three day weekend
	// 3 days are added for every weekend to make sure that we cover enough for the jump.
	aDays = parseInt(aDays);
	aDays2 = aDays + ((aDays / 7)*3) + 7 // this should sufficiently protect the day jumps
	
	// Variables
	var dArray = []; // to store the dates between the two days.
	var sDate2 = convertDate(sDate);
	var eDate2 = new Date(sDate2);
	
	// Change everything in aCal to upper for comparison.
	toUpper = function(x){ 
		  return x.toUpperCase();
	};
	aCal = aCal.map(toUpper);
	
	// eDate2 needs to be sufficiently into the future for the rest of the function.
	eDate2.setDate(eDate2.getDate() + aDays2);
	
	// will be used to pull sufficient days that are "off"
	var monthsBetween = monthDiff(sDate2,eDate2)+1;

	// Now create an array of dates adding one day to each date.
	for(a = 1; a<= aDays2; a++){
		calcDate = new Date(sDate);
		calcDate.setDate(calcDate.getDate() + a);
		dArray.push(jsDateToASIDate(calcDate)); // watch out this array can get to big very quickly.
	}
	// Now look up the calendars that are going to be excluded.
	// expected return is the calendar ID's
	calNames = aa.calendar.getCalendarNames().getOutput();
	for(x in calNames){
		// IF the name of the calendar is included in the list we need the
		// events from that calendar
		if(exists(calNames[x].getCalendarName().toUpperCase(),aCal)){
			for(a = 0; a <= monthsBetween; a++){
				calE = aa.calendar.getEventSeriesByCalendarID(calNames[x].getCalendarID(),sDate2.getFullYear(),sDate2.getMonth()+a).getOutput();
				for(b in calE){
                    // Get the event details
					var evtDateDate = new Date(calE[b].getStartDate().getTime());
					var evtType = calE[b].getEventType();
					// aa.print(evtDateDate);
					// aa.print(evtDateDate.toString());
					// Now do the COMPARISON
					if(
						1==1
						&& exists(evtType,aDayEx)
						&& exists(jsDateToASIDate(evtDateDate),dArray)
					)
					{
						// aa.print("Removing element...");
						removeA(dArray,jsDateToASIDate(evtDateDate));
						// aa.print(evtDateDate.toString());
					}
				}
			}
		}
	}
	return dArray[aDays-1]; // Return the Date that can be used as a working day.
}

