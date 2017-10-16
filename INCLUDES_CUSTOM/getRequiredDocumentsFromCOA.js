function getRequiredDocumentsFromCOA() {

	logDebug("start getRequiredDocumentsFromCOA(" + [].slice.call(arguments) + ")");

	//TODO: put in checks to validate record types and reference conditions.

	var requirementArray = [];
	var parentCapId;
	parentCapIdString = "" + cap.getParentCapID();
	if (parentCapIdString) {
		pca = parentCapIdString.split("-");
		parentCapId = aa.cap.getCapID(pca[0], pca[1], pca[2]).getOutput();
	}

	if (parentCapId) {  // should always be true for amendment
	var c = aa.capCondition.getCapConditions(parentCapId).getOutput();
	for (var i in c) { 
		var coa = c[i];
		if ("Y".equals(coa.getConditionOfApproval())) {
			var cm = coa.getCapConditionModel();
			if("Incomplete".equals(cm.getConditionStatus())) {  // only prompt for COA marked Incomplete
				var req = {};
				req.condition = cm.getConditionDescription();
				req.document = cm.getConditionDescription();
				requirementArray.push(req);
				}
			}
		}
	}

	logDebug("Num of Req Docs:" + requirementArray.length + " docs.");
	logDebug("All req docs: " + requirementArray);

	return requirementArray;
}
