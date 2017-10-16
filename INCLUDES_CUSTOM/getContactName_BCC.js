function getContactName_BCC(vConObj) {
	if (vConObj.people.getContactTypeFlag() == "organization") {
		return vConObj.people.getBusinessName();
	}
	else {
		if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
			return vConObj.people.getFullName();
		}
		else if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
			return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
		}
	}
}