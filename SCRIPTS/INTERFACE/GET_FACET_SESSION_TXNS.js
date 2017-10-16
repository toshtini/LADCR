var array = [];
var sql = "SELECT " +
"aaa.SERV_PROV_CODE, " +
"base_record.B1_PER_ID1, " +
"base_record.B1_PER_ID2, " +
"base_record.B1_PER_ID3, " +
"base_record.B1_PER_CATEGORY as RECORD_TYPE, " +
"payment.PAYMENT_SEQ_NBR as PAYMENT_ID, " +
"payment.F4PAYMENT_UDF1 as UDF1, " +
"payment.F4PAYMENT_UDF2 as UDF2, " +
"payment.F4PAYMENT_UDF3 as UDF3, " +
"fee.FEEITEM_SEQ_NBR as FEE_ID, " +
"fee.GF_DES as FEE_DESCRIPTION, " +
"payment_fee.FEE_ALLOCATION as FEE_APPLIED_PAYMENT, " +
"fee_schedule.EFF_DATE as FISCAL_YEAR, " +
"payment.PAYMENT_DATE as COLLECTED_DATE, " +
"payment.PAYMENT_METHOD as PAY_BY_TYPE, " +
"payment.CHECK_NUMBER as CHECK_NO, " +
"payment.RECEIPT_NBR as RECEIPT_NO," +
"cashier_session.DEPOSIT_SLIP_NBR as BANK_DEPOSIT_NO, " +
"cashier_session.DEPOSIT_DATE as BANK_DEPOSIT_DATE, " +
"licensee_address.G7_ADDRESS1 as PAYOR_ADDRESS1, " +
"licensee_address.G7_ADDRESS2 as PAYOR_ADDRESS2, " +
"licensee_address.G7_ADDRESS3 as PAYOR_ADDRESS3, " +
"licensee_address.G7_CITY as PAYOR_CITY, " +
"licensee_address.G7_COUNTRY_CODE as PAYOR_COUNTRY, " +
"licensee.B1_FNAME as PAYOR_NAME_FIRST, " +
"licensee.B1_MNAME as PAYOR_NAME_M, " +
"licensee.B1_LNAME as PAYOR_NAME_LAST, " +
"licensee.B1_PHONE1 as PAYOR_PHONE, " +
"licensee_address.G7_STATE as PAYOR_STATE, " +
"licensee_address.G7_ZIP as PAYOR_ZIP, " +
"base_record.B1_ALT_ID as LIC_NO, " +
"parent_record.B1_ALT_ID as PARENT_LIC_NO, " +
"app_type.R1_APP_TYPE_ALIAS as LIC_TYPE, " +
"parent_app_type.R1_APP_TYPE_ALIAS as PARENT_LIC_TYPE, " +
"licensee_address.G7_ADDRESS1 as LICENSEE_ADDRESS1, " +
"licensee_address.G7_ADDRESS2 as LICENSEE_ADDRESS2, " +
"licensee_address.G7_ADDRESS3 as LICENSEE_ADDRESS3, " +
"licensee_address.G7_CITY as LICENSEE_CITY, " +
"licensee_address.G7_COUNTRY_CODE as LICENSEE_COUNTRY, " +
"expiration.EXPIRATION_DATE as LIC_EXP_DATE, " +
"parent_expiration.EXPIRATION_DATE as PARENT_LIC_EXP_DATE, " +
"licensee.B1_BUSINESS_NAME as BUSINESS_NAME, " +
"licensee.B1_BUSINESS_NAME2 as BUSINESS_NAME2, " +
//phone on G7 is null so taking from B3
"licensee.B1_PHONE1 as LICENSEE_PHONE, " +
"licensee_address.G7_STATE as LICENSEE_STATE, " +
"licensee_address.G7_ZIP as LICENSEE_ZIP, " +
"fee.GF_L1 as ACCOUNT_CODE, " +
"fee.GF_L2 as INDEX_CODE, " +
"fee.GF_L3 as PCA, " +
"payment.PAYMENT_AMOUNT as APPLIED_PAYMENT " +

"FROM ACCOUNTING_AUDIT_TRAIL aaa, " +
"B3CONTACT licensee, " +
"XRECORD_CONTACT_ENTITY lic_x_add, " +
"G7CONTACT_ADDRESS licensee_address, " +
"X4PAYMENT_FEEITEM payment_fee, " +
"F4FEEITEM fee, " +
"RFEE_SCHEDULE fee_schedule, " +
"B1PERMIT base_record, " +
"R3APPTYP app_type, " +
"F4CASHIER_SESSION cashier_session, " +
"F4PAYMENT payment " +

//applications won't have expiration
"LEFT JOIN B1_EXPIRATION expiration " +
"   ON expiration.SERV_PROV_CODE = payment.SERV_PROV_CODE " +
"   AND expiration.B1_PER_ID1 = payment.B1_PER_ID1 " +
"   AND expiration.B1_PER_ID2 = payment.B1_PER_ID2 " +
"   AND expiration.B1_PER_ID3 = payment.B1_PER_ID3 " +
//if parent record exists join that to expiration
"LEFT JOIN XAPP2REF base_to_parent " +
"   ON base_to_parent.SERV_PROV_CODE = payment.SERV_PROV_CODE " +
"   AND base_to_parent.B1_PER_ID1 = payment.B1_PER_ID1 " +
"   AND base_to_parent.B1_PER_ID2 = payment.B1_PER_ID2 " +
"   AND base_to_parent.B1_PER_ID3 = payment.B1_PER_ID3 " +
"   AND base_to_parent.B1_RELATIONSHIP = 'R' " +
"LEFT JOIN B1PERMIT parent_record " +
"   ON base_to_parent.MASTER_SERV_PROV_CODE = parent_record.SERV_PROV_CODE " +
"   AND base_to_parent.B1_MASTER_ID1 = parent_record.B1_PER_ID1 " +
"   AND base_to_parent.B1_MASTER_ID2 = parent_record.B1_PER_ID2 " +
"   AND base_to_parent.B1_MASTER_ID3 = parent_record.B1_PER_ID3 " +
"   AND parent_record.B1_PER_CATEGORY = 'License' " +
"LEFT JOIN B1_EXPIRATION parent_expiration " +
"   ON parent_expiration.SERV_PROV_CODE = parent_record.SERV_PROV_CODE " +
"   AND parent_expiration.B1_PER_ID1 = parent_record.B1_PER_ID1 " +
"   AND parent_expiration.B1_PER_ID2 = parent_record.B1_PER_ID2 " +
"   AND parent_expiration.B1_PER_ID3 = parent_record.B1_PER_ID3 " +
//r3apptype for parent license type
"LEFT JOIN R3APPTYP parent_app_type " +
"   ON parent_app_type.SERV_PROV_CODE = parent_record.SERV_PROV_CODE " +
"   AND parent_app_type.R1_PER_GROUP = parent_record.B1_PER_GROUP " +
"   AND parent_app_type.R1_PER_TYPE = parent_record.B1_PER_TYPE " +
"   AND parent_app_type.R1_PER_SUB_TYPE = parent_record.B1_PER_SUB_TYPE " +
"   AND parent_app_type.R1_PER_CATEGORY = parent_record.B1_PER_CATEGORY " +

"WHERE aaa.SERV_PROV_CODE = '" + aa.getServiceProviderCode() + "'" +
//payment
"AND aaa.PAYMENT_SEQ_NBR = payment.PAYMENT_SEQ_NBR " +
"AND aaa.SERV_PROV_CODE = payment.SERV_PROV_CODE " +
//cashier session
"AND cashier_session.SERV_PROV_CODE = aaa.SERV_PROV_CODE " +
"AND cashier_session.SESSION_NBR = aaa.SESSION_NBR " +
//licensee
"AND licensee.SERV_PROV_CODE = base_record.SERV_PROV_CODE " +
"AND licensee.B1_PER_ID1 = base_record.B1_PER_ID1 " +
"AND licensee.B1_PER_ID2 = base_record.B1_PER_ID2 " +
"AND licensee.B1_PER_ID3 = base_record.B1_PER_ID3 " +
"AND licensee.B1_CONTACT_TYPE = 'Business' " +
"AND licensee.REC_STATUS      = 'A' " +
//XRECORD_CONTACT_ENTITY - licensee to licensee address mapping
"AND lic_x_add.SERV_PROV_CODE = base_record.SERV_PROV_CODE " +
"AND lic_x_add.B1_PER_ID1 = base_record.B1_PER_ID1 " +
"AND lic_x_add.B1_PER_ID2 = base_record.B1_PER_ID2 " +
"AND lic_x_add.B1_PER_ID3 = base_record.B1_PER_ID3 " +
"AND lic_x_add.B1_CONTACT_NBR = licensee.B1_CONTACT_NBR " +
"AND lic_x_add.ENT_TYPE IN ('CONTACT','CAP_CONTACT') " +
//G7CONTACT_ADDRESS - licensee address
"AND licensee_address.SERV_PROV_CODE = base_record.SERV_PROV_CODE " +
"AND licensee_address.RES_ID = lic_x_add.ENT_ID1 " +
"AND licensee_address.G7_ENTITY_TYPE = lic_x_add.ENT_TYPE " +
"AND licensee_address.G7_ADDRESS_TYPE = 'Premise' " +
"AND licensee_address.REC_STATUS = 'A' " +
//payment to payment_fee
"AND payment.SERV_PROV_CODE = payment_fee.SERV_PROV_CODE " +
"AND payment.B1_PER_ID1 = payment_fee.B1_PER_ID1 " +
"AND payment.B1_PER_ID2 = payment_fee.B1_PER_ID2 " +
"AND payment.B1_PER_ID3 = payment_fee.B1_PER_ID3 " +
"AND payment.PAYMENT_SEQ_NBR = payment_fee.PAYMENT_SEQ_NBR " +
//fee to payment_fee
"AND fee.SERV_PROV_CODE = payment_fee.SERV_PROV_CODE " +
"AND fee.B1_PER_ID1 = payment_fee.B1_PER_ID1 " +
"AND fee.B1_PER_ID2 = payment_fee.B1_PER_ID2 " +
"AND fee.B1_PER_ID3 = payment_fee.B1_PER_ID3 " +
"AND fee.FEEITEM_SEQ_NBR = payment_fee.FEEITEM_SEQ_NBR " +
//fee to fee_schedule
"AND fee.SERV_PROV_CODE = fee_schedule.SERV_PROV_CODE " +
"AND fee.GF_FEE_SCHEDULE = fee_schedule.FEE_SCHEDULE_NAME " +
"AND fee.FEE_SCHEDULE_VERSION = fee_schedule.FEE_SCHEDULE_VERSION " +
//record
"AND base_record.SERV_PROV_CODE = payment.SERV_PROV_CODE " +
"AND base_record.B1_PER_ID1 = payment.B1_PER_ID1 " +
"AND base_record.B1_PER_ID2 = payment.B1_PER_ID2 " +
"AND base_record.B1_PER_ID3 = payment.B1_PER_ID3 " +
//r3apptype for license type
"AND app_type.SERV_PROV_CODE = base_record.SERV_PROV_CODE " +
"AND app_type.R1_PER_GROUP = base_record.B1_PER_GROUP " +
"AND app_type.R1_PER_TYPE = base_record.B1_PER_TYPE " +
"AND app_type.R1_PER_SUB_TYPE = base_record.B1_PER_SUB_TYPE " +
"AND app_type.R1_PER_CATEGORY = base_record.B1_PER_CATEGORY " +
//misc filter
"AND aaa.ACTION = 'Payment' " +
"AND payment.F4PAYMENT_UDF1 is null " +
"AND payment.PAYMENT_METHOD != 'Credit Card' " +
"AND cashier_session.DEPOSIT_SLIP_NBR IS NOT NULL " +

"ORDER BY payment.PAYMENT_SEQ_NBR";

try {
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();
    var sStmt = conn.prepareStatement(sql);
    var rSet = sStmt.executeQuery();
    while (rSet.next()) {
        var obj = {};
        var md = rSet.getMetaData();
        var columns = md.getColumnCount();
        for (i = 1; i <= columns; i++) {
            obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
        }
        obj.count = rSet.getRow();
        array.push(obj)
    }
    aa.env.setValue("returnCode", "0"); // success
    aa.env.setValue("returnValue", JSON.stringify(array));
    aa.print(JSON.stringify(array));
    rSet.close();
    sStmt.close();
    conn.close();
} catch (err) {
    aa.env.setValue("returnCode", "-1"); // error
    aa.env.setValue("returnValue", err.message);
    aa.print(err.message);
}

