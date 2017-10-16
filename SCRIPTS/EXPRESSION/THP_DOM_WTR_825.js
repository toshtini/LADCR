var servProvCode=expression.getValue("$$servProvCode$$").value;
var domExempt=expression.getValue("ASI::DOMESTIC_WATER::DOM_EXAMPTION");
var domExemptDesc=expression.getValue("ASI::DOMESTIC_WATER::DOM_EXAMPTION_DESC");
var domLtr=expression.getValue("ASI::DOMESTIC_WATER::DOM_LETTER");
var domLtrDate=expression.getValue("ASI::DOMESTIC_WATER::DOM_LETTER_DATE");
var domNews=expression.getValue("ASI::DOMESTIC_WATER::DOM_NEWSPAPER");
var domNewsDate=expression.getValue("ASI::DOMESTIC_WATER::DOM_NEWSPAPER_DATE");

var totalRowCount = expression.getTotalRowCount();

if((domLtr.value!=null && (domLtr.value.equalsIgnoreCase('NO') || domLtr.value.equalsIgnoreCase('N') || domLtr.value.equalsIgnoreCase('UNCHECKED') || domLtr.value.equalsIgnoreCase('UNSELECTED') || domLtr.value.equalsIgnoreCase('FALSE') || domLtr.value.equalsIgnoreCase('OFF')))){
	domLtrDate.hidden=true;
	expression.setReturn(domLtrDate);
}else{ 
	domLtrDate.hidden=false;
	expression.setReturn(domLtrDate);
}

if((domNews.value!=null && (domNews.value.equalsIgnoreCase('NO') || domNews.value.equalsIgnoreCase('N') || domNews.value.equalsIgnoreCase('UNCHECKED') || domNews.value.equalsIgnoreCase('UNSELECTED') || domNews.value.equalsIgnoreCase('FALSE') || domNews.value.equalsIgnoreCase('OFF')))){
	domNewsDate.hidden=true;
	expression.setReturn(domNewsDate);
}else{ 
	domNewsDate.hidden=false;
	expression.setReturn(domNewsDate);
}

if((domExempt.value!=null && (domExempt.value.equalsIgnoreCase('NO') || domExempt.value.equalsIgnoreCase('N') || domExempt.value.equalsIgnoreCase('UNCHECKED') || domExempt.value.equalsIgnoreCase('UNSELECTED') || domExempt.value.equalsIgnoreCase('FALSE') || domExempt.value.equalsIgnoreCase('OFF')))){
	domLtr.hidden=true;
	expression.setReturn(domLtr);
	domNews.hidden=true;
	expression.setReturn(domNews);
	domExemptDesc.hidden=true;
	expression.setReturn(domExemptDesc);
}else{ 
	domLtr.hidden=false;
	expression.setReturn(domLtr);
	domNews.hidden=false;
	expression.setReturn(domNews);
	domExemptDesc.hidden=false;
	expression.setReturn(domExemptDesc);
}
