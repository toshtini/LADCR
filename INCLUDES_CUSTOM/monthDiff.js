
function monthDiff(startDate, endDate) { //
    var months;
	// convert to a date
	startDate = convertDate(startDate);
	endDate = convertDate(endDate);
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