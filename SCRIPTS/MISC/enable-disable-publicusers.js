

try {

	var sql;
	// disable all active ACA users from LADCR agency
	// -- disable only for LADCR agency.  Won't effect other agencies for this public user
	// -- on login, user will see that their account is not active
	// -- setting agency activation status to 'GOLIVE' so we can revert back only accounts that were active
	// -- for testing accounts to work, they must be manually activated after this query runs
	
	
	var sql = "UPDATE XPUBLICUSER_SERVPROV SET STATUS = 'GOLIVE' " +
		"WHERE STATUS='ACTIVE' AND " +
		"SERV_PROV_CODE = 'LADCR'";
	
	
	// re-enable all ACA users for LADCR agency
	// -- only accounts that were previously active will be activated

	/*
	var sql = "UPDATE XPUBLICUSER_SERVPROV SET STATUS = 'ACTIVE' " +
		"WHERE STATUS='GOLIVE' AND " +
		"SERV_PROV_CODE = 'LADCR'";
	*/
	
	if (sql) {		
		doSQL(sql);
	}



	}
catch (err) {
	aa.print("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	}



function doSQL(sql) {

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
		} else {
			aa.print("(doSQL) executing : " + sql);
			var r = sStmt.executeUpdate();
			aa.print("(doSQL) number of rows affected : " + r);
		}

		sStmt.close();
		conn.close();
	} catch (err) {
		aa.print(err.message);
	}
}



