// check satisfied conditions vs the required document workflow requirements

var condData = null; // for performance reasons, only load if needed
var failedConds = [];
var appliedStatuses = ["Incomplete","Applied"];
r = getRequiredDocuments(false);

logDebug("CHECK ALL REQUIREMENTS MET: " + r.length + " Requirements on this record");
for (var i in r) {
	var thisReq = r[i];
	logDebug("CHECK ALL REQUIREMENTS MET: " + thisReq.condition);	
	if (thisReq.workflow) {
		for (var j in thisReq.workflow) {
			var thisWf = thisReq.workflow[j];
			logDebug("CHECK ALL REQUIREMENTS MET: " + thisReq.condition + " workflow " + j + "[" + thisWf.task +"," + thisWf.status + "]");
			if (thisWf.task.equals(wfTask) && thisWf.status.equals(wfStatus)) {
				logDebug("CHECK ALL REQUIREMENTS MET: " + thisReq.condition + " matches workflow ");
				if (!condData) {
					condData = loadConditionData();
					logDebug("CHECK ALL REQUIREMENTS MET: loaded " + condData.length + " conditions on this record");

				}
				for (var k in condData) {
					var thisCond = condData[k];
					if (thisCond.name.equals(thisReq.condition) && appliedStatuses.indexOf(thisCond.status) >= 0) {
						failedConds.push(thisCond);
						comment("'" + wfStatus + "' cannot be selected because the " + thisCond.name + " requirement has not been signed off.");	
						logDebug("Condition " + thisCond.name + " is status " + thisCond.status + ".  Cannot proceed workflow");
					}
				}
			}
		}
	}
}


if (failedConds.length > 0) {
	cancel = true;
	showMessage = true;
}
// End script to prevent issuance if all requirements have not been met


function loadConditionData() {
	var conds = [];
	var condResult = aa.capCondition.getCapConditions(capId);
	if (condResult.getSuccess()) {
		var capConds = condResult.getOutput();
	} else {
		logDebug("**ERROR: getting record conditions: " + condResult.getErrorMessage());
		return null;
	}

	for (cc in capConds) {
		var cond = {};
		var thisCond = capConds[cc];

		cond.status = "" + thisCond.getConditionStatus();
		cond.type = "" + thisCond.getConditionType();
		cond.name = "" + thisCond.getConditionDescription();
		conds.push(cond);
	}
	return conds;
}
