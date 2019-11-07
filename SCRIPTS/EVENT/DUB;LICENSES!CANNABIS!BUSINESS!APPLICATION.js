
if (publicUser && cap.isCompleteCap()) {
	cancel = true;
	showMessage = true;
	comment('Uploads are not allowed after the record has been submitted');
}
