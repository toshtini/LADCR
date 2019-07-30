// If the record is a PCN then assess these fees
if(AInfo["Retailer Commercial Cannabis Activity license in an area of Undue Concentration?"] == "Yes"){
    updateFee("J097","CAN_BUS_APP","FINAL",1,"Y");
}
else{
// Else assess these fees
// Turn off for P3R1
/*********************************************************
updateFee("F100","CAN_BUS_APP","FINAL",1,"Y");

if (AInfo["Medical Retail"] == "CHECKED") {
    updateFee("J010","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Retail"] == "CHECKED") {
    updateFee("J020","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Medical Delivery"] == "CHECKED") {
    updateFee("J030","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Medical Distributor Transport Only"] == "CHECKED") {
    updateFee("J031","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Delivery Only"] == "CHECKED") {
    updateFee("J035","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Distributor Transport Only"] == "CHECKED") {
    updateFee("J036","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Testing"] == "Yes") {
    updateFee("J040","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Medical Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J060","CAN_BUS_APP","FINAL",1,"Y");
}

//  J061 Medical Cultivation Specialty Cottage Mixed-Light 
/// NO ASI FOR THIS!

if (AInfo["Medical Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J062","CAN_BUS_APP","FINAL",1,"Y");
}

//J063 Medical Cultivation Specialty Mixed-Light
/// NO ASI FOR THIS!

if (AInfo["Medical Cultivation Small Indoor"] == "CHECKED") {
    updateFee("J064","CAN_BUS_APP","FINAL",1,"Y");
}

/// J065 Medical Cultivation Small Mixed-Light
/// NO ASI FOR THIS!

if (AInfo["Medical Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J066","CAN_BUS_APP","FINAL",1,"Y");
}

///J067  Medical Cultivation Medium Mixed-Light
/// NO ASI FOR THIS!

/// J068 Medical Cultivation Nursery
/// NO ASI FOR THIS!

/// J069  Medical Cultivation Large Indoor
/// NO ASI FOR THIS!

if (AInfo["Adult-Use Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J070","CAN_BUS_APP","FINAL",1,"Y");
}

/// J071  Adult-Use Cultivation Specialty Cottage Mixed-Light 
/// NO ASI FOR THIS!

if (AInfo["Adult-Use Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J072","CAN_BUS_APP","FINAL",1,"Y");
}

/// J073 Adult-Use Cultivation Specialty Mixed-Light
/// NO ASI FOR THIS!

if (AInfo["Adult-Use Cultivation Small Indoor"] == "CHECKED") {
    updateFee("J074","CAN_BUS_APP","FINAL",1,"Y");
}
/// J075 Adult-Use Cultivation Small Mixed-Light
/// NO ASI FOR THIS!

if (AInfo["Adult-Use Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J076","CAN_BUS_APP","FINAL",1,"Y");
}
 
///J077 Adult-Use Cultivation Medium Mixed-Light
/// NO ASI FOR THIS!

/// J078 Adult-Use Cultivation Nursery
/// NO ASI FOR THIS!

// J079 Adult-Use Cultivation Large Indoor
/// NO ASI FOR THIS!

if (AInfo["Medical Distributor"] == "CHECKED") {
    updateFee("J080","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Medical Manufacturer Level 1"] == "CHECKED") {
    updateFee("J083","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Medical Manufacturer Level 2"] == "CHECKED") {
    updateFee("J084","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Distributor"] == "CHECKED") {
    updateFee("J090","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Manufacturer Level 1"] == "CHECKED") {
    updateFee("J093","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Manufacturer Level 2"] == "CHECKED") {
    updateFee("J094","CAN_BUS_APP","FINAL",1,"Y");
}
********************************************************/

}
