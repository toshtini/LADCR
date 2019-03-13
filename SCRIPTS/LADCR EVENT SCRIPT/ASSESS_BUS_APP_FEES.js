
updateFee("F100","CAN_BUS_APP","FINAL",1,"Y");

if (AInfo["Adult-Use Retail"] == "CHECKED" || AInfo["Medical Retail"] == "CHECKED") {
    updateFee("J001","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Microbusiness"] == "CHECKED" || AInfo["Medical Microbusiness"] == "CHECKED") {
    updateFee("J002","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Delivery Only"] == "CHECKED" || AInfo["Medical Delivery Only"] == "CHECKED") {
    updateFee("J003","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Distributor Transport Only"] == "CHECKED" || AInfo["Medical Distributor Transport Only"] == "CHECKED" || AInfo["Adult-Use Distributor"] == "CHECKED" || AInfo["Medical Distributor"] == "CHECKED") {
    updateFee("J204","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Specialty Cottage Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J205","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Specialty Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J206","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Small Indoor"] == "CHECKED" || AInfo["Medical Cultivation Small Indoor"] == "CHECKED") {
    updateFee("J207","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Medium Indoor"] == "CHECKED" || AInfo["Medical Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J208","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Manufacturer Level 1"] == "CHECKED" || AInfo["Medical Manufacturer Level 1"] == "CHECKED") {
    updateFee("J209","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Testing"] == "YES" || AInfo["Testing"] == "Yes") {
    updateFee("J040","CAN_BUS_APP","FINAL",1,"Y");
}
