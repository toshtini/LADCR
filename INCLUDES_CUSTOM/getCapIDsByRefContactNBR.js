function getCapIDsByRefContactNBR(conNbr){
	var resArr = new Array();
	var servProvCode=aa.getServiceProviderCode();
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/LADCR");
	var conn = ds.getConnection();
	var selectString = "select DISTINCT B1_PER_ID1, B1_PER_ID2, B1_PER_ID3 from B3CONTACT WHERE SERV_PROV_CODE= ? AND G1_CONTACT_NBR = ? AND REC_STATUS='A'";
	var sStmt = conn.prepareStatement(selectString);
	sStmt.setString(1, servProvCode);
    sStmt.setString(2, conNbr);
	var rSet = sStmt.executeQuery();
	while (rSet.next()) {
		var id1= rSet.getString("B1_PER_ID1");
		var id2= rSet.getString("B1_PER_ID2");
		var id3= rSet.getString("B1_PER_ID3");	
		var resCapID = aa.cap.getCapID(id1,id2,id3);
		if (resCapID.getSuccess()) resArr.push(resCapID.getOutput());
	}
	sStmt.close();
	return resArr;
}
