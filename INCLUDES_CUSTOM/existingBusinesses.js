function getExistingBusinessInfo(C) {
	return existingBusinesses().filter(function (I) {
		return I.B.equals(C)
	})
}
function isGroup1(C) {
	return existingBusinesses().filter(function (I) {
		return I.B.equals(C) && 1 == I.S
	}).length > 0
}
function isGroup2(C) {
	return existingBusinesses().filter(function (I) {
		return I.B.equals(C) && 2 == I.S
	}).length > 0
}
function validateId(C, I, A) {
	var C = String(parseFloat(C.replace(/-/g, ""))),
	I = I.replace(/-/g, ""),
	N = idLookupTable(),
	A = right(A, 4),
	O = N.filter(function (A) {
			return String(A.A).equals(C) && String(A.F).equals(I)
		}),
	T = N.filter(function (I) {
			return String(I.A).equals(C) && String(I.S).equals(A)
		});
	return O.length > 0 || T.length > 0
}
function right(C, I) {
	if (0 >= I)
		return "";
	if (I > String(C).length)
		return C;
	var A = String(C).length;
	return String(C).substring(A, A - I)
}

