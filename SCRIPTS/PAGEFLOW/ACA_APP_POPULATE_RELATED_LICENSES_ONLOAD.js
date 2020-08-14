/*******************************************************
| Script Title: ACA_APP_POPULATE_RELATED_LICENSES_ONLOAD
| Event: on load
| Usage: Copy ASIT parent record into license table
| Update: ghess, 06/10/2019 - hiding page if not renewal
*********************************************************/
var showMessage = false;						// Set to true to see results in popup window
var showDebug = false;							// Set to true to see debug messages in popup window
var message = "";								// Message String
var debug = "";									// Debug String
var br = "<BR>";								// Break Tag

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var currentUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }  // ignore public users

var useAppSpecificGroupName = false;

(function () {
    try {
        var parentCapIdString = String(cap.getParentCapID());
        if (!parentCapIdString) {
			//for non-renewals, hide page
            aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
			return;
        }

        var parentTypeArr = parentCapIdString.split("-");
        var parentCapId = aa.cap.getCapID(parentTypeArr[0], parentTypeArr[1], parentTypeArr[2]).getOutput();
        if (!parentCapId) {
  			//for non-renewals, hide page
            aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
        return;
        }

		var parentAltId = parentCapId.getCustomID();
		

		relASIT = loadASITable4ACA("RELATED APPLICATIONS", cap);

		if (relASIT && relASIT.length > 0) {
			logDebug("table already has rows, exiting");
			return;
		}
		
		var relASIT = [];
		var newRow = [];
		newRow["Application ID"] = new asiTableValObj("Application ID", String(parentAltId),"Y");
		relASIT.push(newRow);
		
		var asit = cap.getAppSpecificTableGroupModel();
		var newASIT = addASITable4ACAPageFlow(asit,"RELATED APPLICATIONS",relASIT);
        aa.env.setValue("CapModel", cap);

		} catch (ex) {
        logDebug("Error: " + ex.message);
			//aa.env.setValue("ErrorCode", "-2");
			//aa.env.setValue("ErrorMessage", debug);

    }

	//aa.env.setValue("ErrorCode", "-2");
	//aa.env.setValue("ErrorMessage", debug);

})();

/******************************************************************************************/

function asiTableValObj(columnName, fieldValue, readOnly) {
    this.columnName = columnName;
    this.fieldValue = fieldValue;
    this.readOnly = readOnly;

    asiTableValObj.prototype.toString = function () { return this.fieldValue }
}


function logDebug(dstr) {
    if (!aa.calendar.getNextWorkDay) {

        var vLevel = 1
        if (arguments.length > 1)
            vLevel = arguments[1]

        if ((showDebug & vLevel) == vLevel || vLevel == 1)
            debug += dstr + br;

        if ((showDebug & vLevel) == vLevel)
            aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
    }
    else {
        debug += dstr + br;
    }
}

function loadASITable4ACA(tname, cap) {
	var gm = cap.getAppSpecificTableGroupModel()
	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
	  var tsm = tai.next();
	  var tn = tsm.getTableName();

      	  if (!tn.equals(tname)) continue;
	  if (tsm.rowIndex.isEmpty()) {
			logDebug("Couldn't load ASI Table " + tname + " it is empty");
			return false;
		}

   	  var tempObject = new Array();
	  var tempArray = new Array();

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  var numrows = 1;

	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			numrows++;
			}
		var tcol = tsmcoli.next();
		var tval = tsmfldi.next();
		var readOnly = 'N';
		var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
		tempObject[tcol.getColumnName()] = fieldInfo;

		}
		tempArray.push(tempObject);  // end of record
	  }
	  return tempArray;
	}

function addASITable4ACAPageFlow(destinationTableGroupModel, tableName, tableValueArray) // optional capId
{
	//  tableName is the name of the ASI table
	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
	//

	var itemCap = capId
		if (arguments.length > 3)
			itemCap = arguments[3]; // use cap ID specified in args

		var ta = destinationTableGroupModel.getTablesMap().values();
	var tai = ta.iterator();

	var found = false;
	while (tai.hasNext()) {
		var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tsm.getTableName().equals(tableName)) {
			found = true;
			break;
		}
	}

	if (!found) {
		logDebug("cannot update asit for ACA, no matching table name");
		return false;
	}

	var i = -1; // row index counter
	if (tsm.getTableFields() != null) {
		i = 0 - tsm.getTableFields().size()
	}

	for (thisrow in tableValueArray) {
		var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
		var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
		var col = tsm.getColumns()
			var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();
			
			if (!tableValueArray[thisrow][colname.getColumnName()]) {
				logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
				tableValueArray[thisrow][colname.getColumnName()] = "";
			}

			if (typeof(tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") // we are passed an asiTablVal Obj
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

			} else // we are passed a string
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");

			}
		}

		i--;

		if (tsm.getTableFields() == null) {
			tsm.setTableFields(fld);
		} else {
			tsm.getTableFields().addAll(fld);
		}

		if (tsm.getReadonlyField() == null) {
			tsm.setReadonlyField(fld_readonly); // set readonly field
		} else {
			tsm.getReadonlyField().addAll(fld_readonly);
		}
	}

	tssm = tsm;
	return destinationTableGroupModel;
}
