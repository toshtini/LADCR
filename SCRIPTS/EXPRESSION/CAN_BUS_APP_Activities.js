//Expression: CAN_BUS_APP_Activities
//Last Update 06/05/2019, ghess - adding renewal check
//--keep Manufacturer Level 2 read-only
function isTrue(o) {
	return o.getValue() == "CHECKED" || o.getValue() == "YES" || o.getValue() == "Yes";
}

function saveAndExit() {
	temporaryLimiter();
	slackDebug("after limiter:  v.M.R value = " +v.M.R.getValue() + " readonly = " + v.M.R.readOnly + " hidden = " + v.M.R.hidden);
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
	slackDebug("exiting:  v.M.R value = " +v.M.R.getValue() + " readonly = " + v.M.R.readOnly + " hidden = " + v.M.R.hidden);
}

function temporaryLimiter() {
	// issue 55.  Temporary Limit to only Medical-Use Retail and Adult-Use Retail selections.

	v.a.setValue("CHECKED");
	v.a.readOnly = true;
	v.a.hidden = true;
	v.m.setValue("CHECKED");
	v.m.readOnly = true;
	v.m.hidden = true;

	for (var i in v.A) {
		if (i == "R") {
			// allowed
			v.A[i].hidden = false;
			v.A[i].readOnly = false;
		} else {
			v.A[i].hidden = true;
			v.A[i].readOnly = true;
		}
	}

	for (var i in v.M) {
		if (i == "R") {
			v.M[i].hidden = false;
			v.M[i].readOnly = false;
		} else {
			v.M[i].hidden = true;
			v.M[i].readOnly = true;
		}
	}

	v.t.setValue("UNCHECKED");
	v.t.readOnly = true;
	v.t.hidden = true;
	v.d.readOnly = true;
	v.d.hidden = true;
	v.D.ATO.readOnly = true;
	v.D.ATO.hidden = true;
	v.D.MTO.readOnly = true;
	v.D.MTO.hidden = true;

}

try {
	var logDebug = true;
	var debug = "";
	renewalFlag = expression.getValue("ASI::APPLICATION OPTIONS::Is this a Renewal?");

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

	slackDebug("starting:  v.M.R value = " +v.M.R.getValue() + " readonly = " + v.M.R.readOnly + " hidden = " + v.M.R.hidden);
	
	if (!isTrue(renewalFlag)) {
		/*
		// limit activities if not renewal
		debug += "Here not renewal";
		v.a.hidden = true;
		v.m.hidden = true;
		v.d.hidden = true;
		expression.setReturn(v.a);
		expression.setReturn(v.m);
		expression.setReturn(v.d);
		expression.setReturn(v.t);

		for (var i in v.A) {
		v.A[i].hidden = true;
		expression.setReturn(v.A[i]);
		}
		for (var i in v.M) {
		v.M[i].hidden = true;
		expression.setReturn(v.M[i]);
		}
		for (var i in v.D) {
		v.D[i].hidden = true;
		expression.setReturn(v.D[i]);
		}
		 */

		saveAndExit();

	} else {

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

		saveAndExit();

	}

	if (logDebug) {
		slackDebug(debug);
		/*
		var f = expression.getValue("ASI::FORM");
		f.message = debug;
		v.a.message = debug;
		expression.setReturn(f);
		expression.setReturn(v.a);
		 */
	}
} catch (err) {
	slackDebug(err.message);
	slackDebug(debug);
	/*var f = expression.getValue("ASI::FORM");
	f.message = err.message;
	expression.setReturn(f);
	 */
}

function slackDebug(msg) {
	ENVIRON = "SUPP";

	var aa = expression.getScriptRoot();
	var headers = aa.util.newHashMap();

	headers.put("Content-Type", "application/json");

	var body = {};
	body.text = aa.getServiceProviderCode() + ":" + ENVIRON + ": " + msg;

	//body.attachments = [{"fallback": "Full Debug Output"}];
	//body.attachments[0].text = debug;

	var apiURL = "https://hooks.slack.com/services/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"; // from globals


	var result = aa.httpClient.post(apiURL, headers, JSON.stringify(body));
}
