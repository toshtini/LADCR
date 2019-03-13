// Begin script to set 'Awaiting Data Entry' for back office submittals. Runs the WTUA event for Application Acceptance - Awaiting Data Entry
include("AWAITING_DATA_ENTRY");
// End script to set 'Awaiting Data Entry' for back office submittals

// Begin script to move workflow task Issuance to Issued, Temporarily Issued, or Provisionally Issued once payment has been recieved. Runs thr WTUA event for the given type of issuance.
include("UPDATE_APPLICATION_ISSUANCE");
// End script to move workflow task Issuance to Issued, Temporarily Issued, or Provisionally Issued once payment has been recieved. Runs thr WTUA event for the given type of issuance.

// Begin script to move workflow task Application Acceptance to Submitted once payment has been recieved. Runs thr WTUA event.
include("UPDATE_APPLICATION_ACCEPTANCE");
// End script to move workflow task Application Acceptance to Submitted once payment has been recieved. Runs thr WTUA event.

// Begin script to send local authorization notice. added 11/15/18
include("SEND_LOCAL_AUTH_NOTICE");
// End script to send local authorization notice.
