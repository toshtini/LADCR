var servProvCode=expression.getValue("$$servProvCode$$").value;
var senWater=expression.getValue("ASI::SENSITIVE_WATERSHEDS::SEN_WATHERSHEDS");
var senWaterDesc=expression.getValue("ASI::SENSITIVE_WATERSHEDS::SEN_WATHERSHEDS_DESC");

var totalRowCount = expression.getTotalRowCount();

if((senWater.value!=null && (senWater.value.equalsIgnoreCase('YES') || senWater.value.equalsIgnoreCase('Y') || senWater.value.equalsIgnoreCase('CHECKED') || senWater.value.equalsIgnoreCase('SELECTED') || senWater.value.equalsIgnoreCase('TRUE') || senWater.value.equalsIgnoreCase('ON'))) ){
	senWaterDesc.hidden=false;
	expression.setReturn(senWaterDesc);
}else{ 
	senWaterDesc.hidden=true;
	expression.setReturn(senWaterDesc);
}
