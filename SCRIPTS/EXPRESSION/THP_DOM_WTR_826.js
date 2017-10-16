var servProvCode=expression.getValue("$$servProvCode$$").value;
var domInfoRec=expression.getValue("ASI::DOMESTIC_WATER::DOM_INFO_REC");
var domInfoAdded=expression.getValue("ASI::DOMESTIC_WATER::DOM_INFO_ADD");
var domInfoAddDesc=expression.getValue("ASI::DOMESTIC_WATER::DOM_INFO_ADD_DESC");

var totalRowCount = expression.getTotalRowCount();

if((domInfoRec.value!=null && (domInfoRec.value.equalsIgnoreCase('YES') || domInfoRec.value.equalsIgnoreCase('Y') || domInfoRec.value.equalsIgnoreCase('CHECKED') || domInfoRec.value.equalsIgnoreCase('SELECTED') || domInfoRec.value.equalsIgnoreCase('TRUE') || domInfoRec.value.equalsIgnoreCase('ON'))) && (domInfoAdded.value!=null && (domInfoAdded.value.equalsIgnoreCase('YES') || domInfoAdded.value.equalsIgnoreCase('Y') || domInfoAdded.value.equalsIgnoreCase('CHECKED') || domInfoAdded.value.equalsIgnoreCase('SELECTED') || domInfoAdded.value.equalsIgnoreCase('TRUE') || domInfoAdded.value.equalsIgnoreCase('ON'))) ){
	domInfoAddDesc.hidden=false;
	domInfoAddDesc.required=true;
	expression.setReturn(domInfoAddDesc);
}else{ 
	domInfoAddDesc.hidden=true;
	domInfoAddDesc.required=false;
	expression.setReturn(domInfoAddDesc);
}
