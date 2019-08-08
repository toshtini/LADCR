function updateASITRefContact(table,subgroup,column,value,firstName,lastName, phone1,email){
	var sql = "SELECT A.B1_PER_ID1, A.B1_PER_ID2, A.B1_PER_ID3 "
	+ " FROM BAPPSPECTABLE_VALUE A "
	+ " WHERE A.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "'"
	+ " AND A.COLUMN_NAME = '" + column + "'"
	+ " AND A.GROUP_NAME = '" + subgroup  + "'"
	+ " AND TABLE_NAME = '" + table + "'"
	+ " AND ATTRIBUTE_VALUE = '" + value + "'";
	var x = doSQL(sql);
	var r = [];
	if (x) {
		for (var i in x) {
			var item = x[i];
			r.push(aa.cap.getCapID(item.B1_PER_ID1, item.B1_PER_ID2, item.B1_PER_ID3).getOutput());
		}
	}
	for (var i in r) {
		logDebug("Record[" + i + "]: " + r[i].getCustomID());
		customListColumnUpdate(r[i], table, column, value, "First Name", firstName)
		customListColumnUpdate(r[i], table, column, value, "Last Name", lastName)
		customListColumnUpdate(r[i], table, column, value, "Phone Number", phone1)
		customListColumnUpdate(r[i], table, column, value, "Email Address", email)
	}
}