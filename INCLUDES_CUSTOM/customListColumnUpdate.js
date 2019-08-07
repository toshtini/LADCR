function customListColumnUpdate(capIDModel, tableName, searchColumnName, searchValue, columnToUpdate, valueToUpdate){
	logDebug(" ");
	logDebug("capIDModel: " + capIDModel);
	logDebug("tableName: " + tableName);
	logDebug("searchColumnName: " + searchColumnName);
	logDebug("searchValue: " + searchValue);
	logDebug("columnToUpdate: " + columnToUpdate);
	logDebug("valueToUpdate: " + valueToUpdate);

	// Create a HashMap.
	var searchConditionMap = aa.util.newHashMap();
	
	// Create a List object to add the value of Column.
	var valuesList = aa.util.newArrayList();
	valuesList.add(searchValue);

	searchConditionMap.put(searchColumnName, valuesList);

	var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIDModel, tableName, searchConditionMap);
	logDebug("appSpecificTableInfo.getSuccess(): " + appSpecificTableInfo.getSuccess());
	if (appSpecificTableInfo.getSuccess())
	{
		var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
		var tableFields = appSpecificTableModel.getTableFields(); 
		logDebug("tableFields.size(): " + tableFields.size());
		if (tableFields != null && tableFields.size() > 0)
		{
			var updateRowsMap = aa.util.newHashMap(); 
			for (var i=0; i < tableFields.size(); i++)
			{
				var fieldObject = tableFields.get(i); 
				//get the column name.
				var columnName = fieldObject.getFieldLabel();
				//get the value of column
				var columnValue = fieldObject.getInputValue();
				//get the row ID 
				var rowID = fieldObject.getRowIndex();
				logDebug("columnName: " + columnName);
				logDebug("columnValue: " + columnValue);
				logDebug("rowID: " + rowID);
				if (columnName == searchColumnName){
					setUpdateColumnValue(updateRowsMap, rowID, columnToUpdate, valueToUpdate);
				}
			}
			if (!updateRowsMap.isEmpty()){
				updateAppSpecificTableInfors(tableName, capIDModel, updateRowsMap);
			}
		}	
	}

	function setUpdateColumnValue(updateRowsMap, rowID, columnName, columnValue){
		logDebug("in setUpdateColumnValue");
		var updateFieldsMap = updateRowsMap.get(rowID);
		if (updateFieldsMap == null)
		{
			updateFieldsMap = aa.util.newHashMap();
			updateRowsMap.put(rowID, updateFieldsMap);
		}
		updateFieldsMap.put(columnName, columnValue);
	}


	function updateAppSpecificTableInfors(tableName, capIDModel, updateRowsMap){
		if (updateRowsMap == null || updateRowsMap.isEmpty())
		{
			return;
		}
		
		var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
		var asitTableModel = asitTableScriptModel.getTabelModel();
		var rowList = asitTableModel.getRows();
		asitTableModel.setSubGroup(tableName);
		var rowIdArray = updateRowsMap.keySet().toArray();
		for (var i = 0; i < rowIdArray.length; i++)
		{
			var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
			var rowModel = rowScriptModel.getRow();
			rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
			rowModel.setId(rowIdArray[i]);
			rowList.add(rowModel);
		}
		return aa.appSpecificTableScript.updateAppSpecificTableInfors(capIDModel, asitTableModel);
	}
	
}