logDebug("contact  Model class is " + ContactModel.getClass());
slackDebug(debug);
var people = aa.people.getPeople(ContactModel.getContactSeqNumber()).getOutput();

var asiObj = null;
var asi = new Array();    // associative array of attributes
var customFieldsObj = null;
var customFields = new Array();
var customTablesObj = null;
var customTables = new Array();

//Attributes
if (people.getAttributes() != null) {
	asiObj = people.getAttributes().toArray();
	if (asiObj != null) {
		for (var xx1 in asiObj) {
			logDebug("ATT : " + asiObj[xx1].attributeName + " = " + asiObj[xx1]);
			asi[asiObj[xx1].attributeName] = asiObj[xx1];
		}   
	}
}

// contact ASI
var tm = people.getTemplate();
if (tm)	{
	var templateGroups = tm.getTemplateForms();
	var gArray = new Array();
	if (!(templateGroups == null || templateGroups.size() == 0)) {
		var subGroups = templateGroups.get(0).getSubgroups();
		if (!(subGroups == null || subGroups.size() == 0)) {
			for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
				var subGroup = subGroups.get(subGroupIndex);
				var fields = subGroup.getFields();
				if (!(fields == null || fields.size() == 0)) {
					for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
						var field = fields.get(fieldIndex);
						logDebug("ASI : " + field.getDisplayFieldName() + " = " + field.getDefaultValue());
						asi[field.getDisplayFieldName()] = field.getDefaultValue();
					}
				}
			}
		}
	}
}