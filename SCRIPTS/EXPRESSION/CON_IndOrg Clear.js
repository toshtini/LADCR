//CON_IndOrg Clear
//deletes data from the hidden fields when contact type flag is toggled (upon submission)
//01/16/2020

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("REFCONTACT::contactTypeFlag");
var variable1=expression.getValue("REFCONTACT::title");
var variable2=expression.getValue("REFCONTACT::firstName");
var variable3=expression.getValue("REFCONTACT::middleName");
var variable4=expression.getValue("REFCONTACT::lastName");
var variable5=expression.getValue("REFCONTACT::fullName");
var variable6=expression.getValue("REFCONTACT::maskedSsn");
var variable7=expression.getValue("REFCONTACT::birthDate");
var variable8=expression.getValue("REFCONTACT::salutation");
var variable9=expression.getValue("REFCONTACT::businessName");
var variable10=expression.getValue("REFCONTACT::tradeName");
var variable11=expression.getValue("REFCONTACT::fein");
var variable12=expression.getValue("REFCONTACT::stateIDNbr");

if(variable0.value!=null && variable0.value.equals("organization")){

	variable1.value=String("");
	expression.setReturn(variable1);

	variable2.value=String("");
	expression.setReturn(variable2);

	variable3.value=String("");
	expression.setReturn(variable3);

	variable4.value=String("");
	expression.setReturn(variable4);

	variable5.value=String("");
	expression.setReturn(variable5);

	variable6.value=String("");
	expression.setReturn(variable6);

	variable7.value="";
	expression.setReturn(variable7);

	variable8.value=String("");
	expression.setReturn(variable8);

	//variable1.message="CON_IndOrg Clear Fired!";
	//expression.setReturn(variable1);

} else {

	variable9.value=String("");
	expression.setReturn(variable9);

	variable10.value=String("");
	expression.setReturn(variable10);

	variable11.value=String("");
	expression.setReturn(variable11);

	variable12.value=String("");
	expression.setReturn(variable12);

	//variable9.message="CON_IndOrg Clear Fired!";
	//expression.setReturn(variable9);

}
