function getRefContactListByTypeAndAttribute(peopType, attrName, attrValue) {
	// get a people model to serach with...
	var peopSearchModelResult = aa.people.createPeopleModel();
	var peopSearchModel = peopSearchModelResult.getOutput().getPeopleModel();
	peopSearchModel.setServiceProviderCode(aa.getServiceProviderCode());

	// find one ref contact of this type
	var peopleSearchResultsResult = aa.people.getPeoplesByAttrs(peopSearchModel, peopType, 'N', null);
	if (peopleSearchResultsResult.getSuccess()) {
		var peopleSearchResults = peopleSearchResultsResult.getOutput();
		if (peopleSearchResults && peopleSearchResults.length > 0) {
			firstPeople = peopleSearchResults[0];
			// get this contact's attribute collection
			var peopTempBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleTemplateBusiness").getOutput();
			refPeopAttrColl = peopTempBiz.getRefPeopleAttributesFromGPeople(aa.getServiceProviderCode(), peopType, firstPeople.getContactSeqNumber(), false, "ADMIN");
			if (refPeopAttrColl) {
				logDebug("Found " + refPeopAttrColl.size() + " attributes");
				newAttrList = aa.util.newArrayList(); // create a new list to search with
				refPeopAttrArr = refPeopAttrColl.toArray();
				for (var x in refPeopAttrArr) {
					conAttrModel = refPeopAttrArr[x]; // ContactAttributeModel
					peopAttrTemplate = conAttrModel.getAttributeTemplate();
					if (conAttrModel.getAttributeName() == attrName) {
						conAttrModel.setAttributeValue(attrValue);
						newAttrList.add(conAttrModel);
					}
				}
				peopSearchModel.setAttributes(newAttrList);
				var peopleSearchResultsResult = aa.people.getPeoplesByAttrs(peopSearchModel, peopType, 'N', null);
				if (peopleSearchResultsResult.getSuccess()) {
					var peopleSearchResults = peopleSearchResultsResult.getOutput();
					if (peopleSearchResults) {
						logDebug("Found " + peopleSearchResults.length + " refContacts");
						return peopleSearchResults;
					}
				}
			}
		}
	}
	return null;
}
