

try {

	var sql;
	// disable all active ACA users from LADCR agency
	// -- disable only for LADCR agency.  Won't effect other agencies for this public user
	// -- on login, user will see that their account is not active
	// -- setting agency activation status to 'GOLIVE' so we can revert back only accounts that were active
	// -- for testing accounts to work, they must be manually activated after this query runs
	
	/*
	var sql = "UPDATE XPUBLICUSER_SERVPROV SET STATUS = 'GOLIVE' " +
		"WHERE STATUS='ACTIVE' AND " +
		"SERV_PROV_CODE = 'LADCR'";
	*/
	
	// re-enable all ACA users for LADCR agency
	// -- only accounts that were previously active will be activated

	
	var sql = "UPDATE XPUBLICUSER_SERVPROV SET STATUS = 'ACTIVE' " +
		"WHERE STATUS='GOLIVE' AND " +
		"SERV_PROV_CODE = 'LADCR'";
	
	if (sql) {		
		doSQL(sql);
	}



	}
catch (err) {
	aa.print("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	}



function doSQL(sql) {

var dq = aa.db.update(sql, []);
if (dq.getSuccess()) {
    var dso = dq.getOutput();
    if (dso) {
        aa.print(dso);
    }
}
else{
    aa.print("error " + dq.getErrorMessage());
}
}



