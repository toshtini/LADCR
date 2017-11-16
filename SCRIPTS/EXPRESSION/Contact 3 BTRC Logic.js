
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

try {
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var msg = "";

// get the EMSE biz object
aa = expression.getScriptRoot();
var SCRIPT_VERSION = "3.2.2";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));



var servProvCode=expression.getValue("$$servProvCode$$").value;
var btrc =expression.getValue("CONTACT3TPLFORM::CON_BUS::BUSINESS CONTACT::BTRC Number");

if (isGroup1(btrc.value)) {
	btrc.message = "Confirmed Prop-D Status";
	}
else if (isGroup2(btrc.value)) {
	btrc.message = "Confirmed Prop-M Status";
	}
else { 
	btrc.message = "Not found for Prop-D or Prop-M Status";
}
expression.setReturn(btrc);


} catch (err) { var btrc =expression.getValue("CONTACT3TPLFORM::CON_BUS::BUSINESS CONTACT::BTRC Number"); 
btrc.message = err.message;
expression.setReturn(btrc);
}

