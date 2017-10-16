function handleError(err,context) {
	var rollBack = true;
	var showError = true;

	if (showError) showDebug = true;
	logDebug((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
	
	// Log to Slack Channel in ETechConsultingLLC.slack.com BCC_EMSE_Debug
	
	var headers=aa.util.newHashMap();

    headers.put("Content-Type","application/json");
	
    var body = {};
	body.text = err.message + " In " + context + " Line " + err.lineNumber + "Stack: " + err.stack;
	body.attachments = [{"fallback": "Full Debug Output"}];
	body.attachments[0].text = debug;
	
    var apiURL = "https://hooks.slack.com/services/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";
	
	
    var result = aa.httpClient.post(apiURL, headers, JSON.stringify(body));
    if (!result.getSuccess()) {
        logDebug("Slack get anonymous token error: " + result.getErrorMessage());
	} else {	
		aa.print("Slack Results: " + result.getOutput());
        }
  	}
	