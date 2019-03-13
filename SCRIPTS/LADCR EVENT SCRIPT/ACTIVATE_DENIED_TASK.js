	//reactivate task after CRC Appeal
	var checkTask = "Supervisor Temp Review";
	var checkStatus = taskStatus(checkTask);
	var deniedTask = "Not Found";

	if (matches(checkStatus,"Abandoned","Void","Withdrawn","Temporary Denied")) {
		deniedTask = checkTask;
	} else {
		checkTask = "Initial Review";
		checkStatus = taskStatus(checkTask);
		
		if (matches(checkStatus,"Abandoned","Void","Withdrawn","Temporary Denied")) {
			deniedTask = checkTask;
		} else {
			checkTask = "Pre-Inspection Review";
			checkStatus = taskStatus(checkTask);

			if (matches(checkStatus,"Inspection Timeout - No Activity")) {
				deniedTask = checkTask;
			}
		}
	}
	
	if (deniedTask != "Not Found"){
	  //branch to that task
	  setTask(wfTask,"N","Y");
	  activateTask(deniedTask);
	  updateTask(deniedTask,"Denial Denied","Returned from " + wfTask,"Script ACTIVATE_DENIED_TASK");
	}
