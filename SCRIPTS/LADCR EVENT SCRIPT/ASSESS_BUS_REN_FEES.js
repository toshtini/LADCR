// If the record is a PCN then assess these fees
if(AInfo["Retailer Commercial Cannabis Activity license in an area of Undue Concentration?"] == "Yes"){
    updateFee("J097","CAN_BUS_REN","FINAL",1,"Y");
}
else{
// Else assess these fees
updateFee("F100","CAN_BUS_REN","FINAL",1,"Y");

if (Info["Adult-Use Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J076","CAN_BUS_REN","FINAL",1,"Y");
}

//J078  Adult-Use Cultivation Nursery
/// NO ASI FOR THIS!

if (Info["Medical Distributor"] == "CHECKED") {
    updateFee("J080","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Retail"] == "CHECKED") {
    updateFee("J010","CAN_BUS_REN","FINAL",1,"Y");
}  

if (Info["Adult-Use Retail"] == "CHECKED") {
    updateFee("J020","CAN_BUS_REN","FINAL",1,"Y");
}   

if (Info["Medical Delivery"] == "CHECKED") {
    updateFee("J030","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Distributor Transport Only"] == "CHECKED") {
    updateFee("J031","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Adult-Use Delivery"] == "CHECKED") {
    updateFee("J035","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Adult-Use Distributor Transport Only"] == "CHECKED") {
    updateFee("J036","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Testing"] == "Yes") {
    updateFee("J040","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J060","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Specialty Cottage Mixed-Light"] == "CHECKED") {
    updateFee("J061","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J062","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Specialty Mixed-Light"] == "CHECKED") {
    updateFee("J063","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Small Indoor"] == "CHECKED") {
    updateFee("J064","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Small Mixed-Light"] == "CHECKED") {
    updateFee("J065","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J066","CAN_BUS_REN","FINAL",1,"Y");
}

//J067 Medical Cultivation Medium Mixed-Light
/// NO ASI FOR THIS!

//J068 Medical Cultivation Nursery 
/// NO ASI FOR THIS!

//J069  Medical Cultivation Large Indoor
/// NO ASI FOR THIS!

if (Info["Adult-Use Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J070","CAN_BUS_REN","FINAL",1,"Y");
}

//J071  Adult-Use Cultivation Specialty Cottage Mixed-Light
/// NO ASI FOR THIS!

if (Info["Adult-Use Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J072","CAN_BUS_REN","FINAL",1,"Y");
}

//J073  Adult-Use Cultivation Specialty Mixed-Light
/// NO ASI FOR THIS!


if (Info["Adult-Use Cultivation Small Indoor"] == "CHECKED") {
    updateFee("J074","CAN_BUS_REN","FINAL",1,"Y");
}

//J075 Adult-Use Cultivation Small Mixed-Light
/// NO ASI FOR THIS!

//J077  Adult-Use Cultivation Medium Mixed-Light 
/// NO ASI FOR THIS!

//J079 Adult-Use Cultivation Large Indoor
/// NO ASI FOR THIS!

if (Info["Medical Manufacturer Level 1"] == "CHECKED") {
    updateFee("J083","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Medical Manufacturer Level 2"] == "CHECKED") {
    updateFee("J084","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Adult-Use Distributor"] == "CHECKED") {
    updateFee("J090","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Adult-Use Manufacturer Level 1"] == "CHECKED") {
    updateFee("J093","CAN_BUS_REN","FINAL",1,"Y");
}

if (Info["Adult-Use Manufacturer Level 2"] == "CHECKED") {
    updateFee("J094","CAN_BUS_REN","FINAL",1,"Y");
}

//Adult-Use Distributor Transport Only  
/// NO FEE FOR THIS IN  THE CAN_BUS_REN Schedule

}