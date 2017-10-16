// Begin script to check that Owner Applicant and Business Owner count matches the Owners ASIT
include("CHECK_OWNER_SUBMITTALS_MATCH_ASIT");
// End script to check that Owner Applicant and Business Owner count matches the Owners ASIT

// Begin script to prevent issuance if fees have not been paid
include("CHECK_FEES_PAID_PRIOR_TO_ISSUANCE");
// End script to prevent issuance if fees have not been paid

// Begin script to check if a temporary license has not been requested or previously issued and prevent if either is yes
include("CHECK_TEMPORARY_REQUESTED");
// End script to check if a temporary license has not been requested or previously issued and prevent if either is yes

// Begin script to check for an Owner Applicant prior to any workflow progress
include("CHECK_OWNER_APPLICANT");
// End script to check for an Owner Applicant prior to any workflow progress