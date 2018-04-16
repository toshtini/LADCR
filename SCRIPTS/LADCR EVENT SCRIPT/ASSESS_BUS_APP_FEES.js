
if (AInfo["Adult-Use Retail"] == "CHECKED" || AInfo["Medical Retail"] == "CHECKED") {
    updateFee("J001","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Microbusiness"] == "CHECKED" || AInfo["Medical Microbusiness"] == "CHECKED") {
    updateFee("J002","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Delivery Only"] == "CHECKED" || AInfo["Medical Delivery Only"] == "CHECKED") {
    updateFee("J003","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Distributor Transport Only"] == "CHECKED" || AInfo["Medical Distributor Transport Only"] == "CHECKED") {
    updateFee("J004","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Specialty Cottage Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Cottage Indoor"] == "CHECKED") {
    updateFee("J005","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Specialty Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Indoor"] == "CHECKED") {
    updateFee("J006","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Small Indoor"] == "CHECKED" || AInfo["Medical Cultivation Small Indoor "] == "CHECKED") {
    updateFee("J007","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Cultivation Medium Indoor"] == "CHECKED" || AInfo["Medical Cultivation Medium Indoor"] == "CHECKED") {
    updateFee("J008","CAN_BUS_APP","FINAL",1,"Y");
}

if (AInfo["Adult-Use Manufacturer Level 1"] == "CHECKED" || AInfo["Medical Manufacturer Level 1"] == "CHECKED") {
    updateFee("J009","CAN_BUS_LIC","FINAL",1,"Y");
}
