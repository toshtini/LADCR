//Expression: CAN_BUS_APP_Activities
//Last Update 03/07/2019, ghess - no change
//--keep Manufacturer Level 2 read-only
function isTrue(o) {
	return o.getValue() == "CHECKED" || o.getValue() == "YES" || o.getValue() == "Yes";
}

function saveAndExit() {
	expression.setReturn(v.a);
	expression.setReturn(v.m);
	expression.setReturn(v.d);
	expression.setReturn(v.t);
	for (var i in v.A) {
		if (!isTrue(v.a)) {
			v.A[i].setValue("UNCHECKED");
		}
		expression.setReturn(v.A[i]);
	}
	for (var i in v.M) {
		if (!isTrue(v.m)) {
			v.M[i].setValue("UNCHECKED");
		}
		expression.setReturn(v.M[i]);
	}
	for (var i in v.D) {
		if (!isTrue(v.d)) {
			v.D[i].setValue("UNCHECKED");
		}
		expression.setReturn(v.D[i]);
	}
}

try {

	var logDebug = false;
	var debug = "";

	var v = {};

	v.a = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult Use");
	v.A = {};
	v.A.CMI = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Cultivation Medium Indoor");
	v.A.CSI = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Cultivation Small Indoor");
	v.A.CSP = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Cultivation Specialty Indoor");
	v.A.D = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Distributor");
	v.A.M1 = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Manufacturer Level 1");
	//v.A.M2 = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Manufacturer Level 2");
	v.A.R = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Retail");
	v.A.M = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Microbusiness");
	v.A.DO = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Delivery Only");

	v.m = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Use");
	v.M = {};
	v.M.CMI = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Cultivation Medium Indoor");
	v.M.CSI = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Cultivation Small Indoor");
	v.M.CSP = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Cultivation Specialty Indoor");
	v.M.D = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Distributor");
	v.M.M1 = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Manufacturer Level 1");
	//v.M.M2 = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Manufacturer Level 2");
	v.M.R = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Retail");
	v.M.M = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Microbusiness");
	v.M.DO = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Delivery Only");
	v.t = expression.getValue("ASI::BUSINESS ACTIVITIES::Testing");

	v.d = expression.getValue("ASI::BUSINESS ACTIVITIES::Distributor Transport Only");
	v.D = {};
	//v.A.DTO = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Distributor Transport Only");
	//v.M.DTO = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Distributor Transport Only");
	v.D.ATO = expression.getValue("ASI::BUSINESS ACTIVITIES::Adult-Use Distributor Transport Only");
	v.D.MTO = expression.getValue("ASI::BUSINESS ACTIVITIES::Medical Distributor Transport Only");

	debug += v.A.CMI.getValue() + "|";
	//
	v.t.readOnly = isTrue(v.a) || isTrue(v.m) || isTrue(v.d);
	v.d.readOnly = isTrue(v.a) || isTrue(v.m) || isTrue(v.t);
	
	v.a.readOnly = isTrue(v.t) || isTrue(v.d);
	if (v.a.readOnly) {
		//v.a.setValue("No");
	}
	v.m.readOnly = isTrue(v.t) || isTrue(v.d);
	if (v.m.readOnly) {
		//v.m.setValue("No");
	}

	if (true) { // group adult-use
		for (var i in v.A) {
			v.A[i].hidden = !isTrue(v.a);
		}
		debug += isTrue(v.A.CMI) + "|";
		v.A.CMI.readOnly = isTrue(v.A.CSI) || isTrue(v.A.CSP) || isTrue(v.M.CSI) || isTrue(v.M.CSP);
		v.A.CSI.readOnly = isTrue(v.A.CMI) || isTrue(v.A.CSP) || isTrue(v.M.CMI) || isTrue(v.M.CSP);
		v.A.CSP.readOnly = isTrue(v.A.CMI) || isTrue(v.A.CSI) || isTrue(v.M.CMI) || isTrue(v.M.CSI);
		//v.A.D.readOnly = isTrue(v.A.DTO) || isTrue(v.M.DTO);
		//v.A.DTO.readOnly = isTrue(v.A.D) || isTrue(v.M.D)
			v.A.M1.readOnly = false;
			//v.A.M2.readOnly = false;
		v.A.M.readOnly = isTrue(v.A.R) || isTrue(v.M.R) || isTrue(v.A.DO) || isTrue(v.M.DO);
		v.A.R.readOnly = isTrue(v.A.M) || isTrue(v.M.M) || isTrue(v.A.DO) || isTrue(v.M.DO);
		v.A.DO.readOnly = isTrue(v.A.M) || isTrue(v.M.M) || isTrue(v.A.R) || isTrue(v.M.R);
	}

	if (true) { // group medical
		for (var i in v.M) {
			v.M[i].hidden = !isTrue(v.m);
		}
		v.M.CMI.readOnly = isTrue(v.A.CSI) || isTrue(v.A.CSP) || isTrue(v.M.CSI) || isTrue(v.M.CSP);
		v.M.CSI.readOnly = isTrue(v.A.CMI) || isTrue(v.A.CSP) || isTrue(v.M.CMI) || isTrue(v.M.CSP);
		v.M.CSP.readOnly = isTrue(v.A.CMI) || isTrue(v.A.CSI) || isTrue(v.M.CMI) || isTrue(v.M.CSI);
		//v.M.D.readOnly = isTrue(v.A.DTO) || isTrue(v.M.DTO);
		//v.M.DTO.readOnly = isTrue(v.A.D) || isTrue(v.M.D)
			v.M.M1.readOnly = false;
			//v.M.M2.readOnly = false;
		v.M.M.readOnly = isTrue(v.A.R) || isTrue(v.M.R) || isTrue(v.A.DO) || isTrue(v.M.DO);
		v.M.R.readOnly = isTrue(v.A.M) || isTrue(v.M.M) || isTrue(v.A.DO) || isTrue(v.M.DO);
		v.M.DO.readOnly = isTrue(v.A.M) || isTrue(v.M.M) || isTrue(v.A.R) || isTrue(v.M.R);
	}

	if (true) { // group Distributor Transport Only
		for (var i in v.D) {
			v.D[i].hidden = !isTrue(v.d);
		}
	}

	debug += v.A.CMI.getValue() + "|";
	saveAndExit();
	debug += v.A.CMI.getValue() + "|";

	if (logDebug) {
		var f = expression.getValue("ASI::FORM");
		f.message = debug;
		v.a.message = debug;
		expression.setReturn(f);
		expression.setReturn(v.a);
	}
} catch (err) {
	var f = expression.getValue("ASI::FORM");
	f.message = err.message;
	expression.setReturn(f);
}
