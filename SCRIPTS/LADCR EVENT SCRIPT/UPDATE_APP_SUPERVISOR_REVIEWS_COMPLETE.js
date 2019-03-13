//Begin Script #46 - When all parallel reviews are complete, set application status to “Pending Final Review”
if (matches(wfTask,"Supervisor Premises Review","Supervisor Owner Review","Supervisor Social Equity Review")) {
	if (isTaskStatus("Supervisor Premises Review","Premises Review Complete") && isTaskStatus("Supervisor Owner Review","Owner Review Complete") && isTaskStatus("Supervisor Social Equity Review","Social Equity Review Complete")) {
		updateAppStatus("Pending Final Review","Updated via script");
	}
}
//End Script #46 - When all parallel reviews are complete, set application status to “Pending Final Review”
