function getRequiredDocuments(isPageFlow) {

	logDebug("start getRequiredDocuments(" + [].slice.call(arguments) + ")");

	//TODO: put in checks to validate record types and reference conditions.
	var capToUse = capId;
	if (isPageFlow) {
		capToUse = cap;
	}
	var requirementArray = [];

	/*------------------------------------------------------------------------------------------------------/
	| Load up Record Types : NEEDS REVIEW, map variables to record types
	/------------------------------------------------------------------------------------------------------*/
	var isApplication = appMatch("Licenses/*/*/Application");
	var isAttestationAmendment = appMatch("Licenses/*/*/Incomplete Attestation");
	var isRenewal = appMatch("Licenses/*/*/Renewal");
	var isOwner = appMatch("Licenses/*/*/Owner Submittal");
	var isOwnerAttestation = appMatch("Licenses/Cannabis/Application Amendment/Incomplete Attestation");
	var isCEOAttestation = appMatch("Licenses/Cannabis/Event Organzier/Incomplete Attestation");
	var isTemporaryEventAttestation = appMatch("Licenses/Cannabis/Temporary Event/Incomplete Attestation");
	
	/*------------------------------------------------------------------------------------------------------/
	| Load up Standard Conditions :
	/------------------------------------------------------------------------------------------------------*/

	var BusinessTaxRegistrationCertificate = {
		condition: "Business Tax Registration Certificate",
		document: "Business Tax Registration Certificate"
	};
	
	var CannabisWasteManagementPlan = {
		condition: "Cannabis Waste Management Plan",
		document: "Cannabis Waste Management Plan"
	}; 
	
	var CommercialCannabisActivityPlan = {
		condition: "Commercial Cannabis Activity Plan",
		document: "Commercial Cannabis Activity Plan"
	}; 

	var DiversityPlan = {
		condition: "Diversity Plan",
		document: "Diversity Plan"
	}; 

	var EnergyEfficiencyPlan = {
		condition: "Energy Efficiency Plan",
		document: "Energy Efficiency Plan"
	}; 

	var CommercialCannabisActivityPlan = {
		condition: "Energy Efficiency Plan",
		document: "Energy Efficiency Plan"
	}; 

	var FinancialInformation = {
		condition: "Financial Information",
		document: "Financial Information"
	}; 

	var FireSafetyPlan = {
		condition: "Fire Safety Plan",
		document: "Fire Safety Plan"
	}; 

	var GovernmentIssuedIdentification = {
		condition: "Government-Issued Identification",
		document: "Government-Issued Identification"
	}; 

	var HiringPlan = {
		condition: "Hiring Plan",
		document: "Hiring Plan"
	}; 

	var ISO170325Accreditation = {
		condition: "ISO 170325 Accreditation",
		document: "ISO 170325 Accreditation"
	}; 

	var LaborPeaceAgreement = {
		condition: "Labor Peace Agreement",
		document: "Labor Peace Agreement"
	}; 

	var LaboratoryEmployeeQualifications = {
		condition: "Laboratory Employee Qualifications",
		document: "Laboratory Employee Qualifications"
	}; 

	var LimitedAccessAreasPlan = {
		condition: "Limited Access Areas Plan",
		document: "Limited Access Areas Plan"
	}; 

	var OrgChart = {
		condition: "Org. Chart",
		document: "Org. Chart"
	}; 

	var RadiusMap = {
		condition: "Radius Map",
		document: "Radius Map"
	}; 

	var SamplingPlansProceduresAndProtocols = {
		condition: "Sampling Plans, Procedures and Protocols",
		document: "Sampling Plans, Procedures and Protocols"
	}; 

	var SecurityPlan = {
		condition: "Security Plan",
		document: "Security Plan"
	}; 

	var StaffingPlan = {
		condition: "Staffing Plan",
		document: "Staffing Plan"
	}; 

	var StandardOperatingProcedures = {
		condition: "Standard Operating Procedures",
		document: "Standard Operating Procedures"
	}; 

	var TestingMethodologies = {
		condition: "Testing Methodologies",
		document: "Testing Methodologies"
	}; 

	/*------------------------------------------------------------------------------------------------------/
	| Load up Conditionals from Record
	/------------------------------------------------------------------------------------------------------*/
	var isMedical =  AInfo["Medical"] == "YES" || AInfo["Medical"] == "Yes"; 
	var isAdultUse =  AInfo["Adult Use"] == "YES" || AInfo["Adult Use"] == "Yes"; 
	var isTesting = AInfo["Testing"] == "YES" || AInfo["Testing"] == "Yes"; 
	var isCultivation = AInfo["Adult-Use Cultivation Medium Indoor"] == "CHECKED" || AInfo["Adult-Use Cultivation Small Indoor"]  == "CHECKED" || AInfo["Adult-Use Cultivation Specialty Cottage Indoor"]  == "CHECKED" || 	AInfo["Adult-Use Cultivation Specialty Indoor"] == "CHECKED" || AInfo["Medical Cultivation Medium Indoor"] == "CHECKED" || AInfo["Medical Cultivation Small Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Cottage Indoor"] == "CHECKED" || AInfo["Medical Cultivation Specialty Indoor"] == "CHECKED";	
	var isTemporaryRequest = isASITrue(AInfo["Are you requesting a temporary license?"]); 
	//set isTemporaryRequest = true if ASI field is null or ""
	if (AInfo["Are you requesting a temporary license?"] == null || AInfo["Are you requesting a temporary license?"] == "") {
		isTemporaryRequest = true;
	}

	logDebug("isTemporaryRequest: " + isTemporaryRequest);

	//check to see if a temporary license has already been issued
	var vWFTaskHistory = aa.workflow.getWorkflowHistory(capId, 'Issuance', null).getOutput();
	var vTaskModel;
	var vTaskStatus;
	var x = 0;
	for (x in vWFTaskHistory) {
		vTaskModel = vWFTaskHistory[x];
		vTaskStatus = vTaskModel.getDisposition();
		if (vTaskStatus == 'Temporarily Issued') {
			isTemporaryRequest = false;
			break;
		}
	}

	if (isAttestationAmendment) {
		isTemporaryRequest = false;
		}

	/*
	var business = getContactObj(capToUse, "Business");
	if (business && business.asi) {
		isSoleOwner = business.asi["What is your business's organizational structure?"] == "Sole Proprietorship";
	}
	*/
	
	/*------------------------------------------------------------------------------------------------------/
	| Business Rules : map variables to standard condition
	/------------------------------------------------------------------------------------------------------*/

	if (isOwner || isOwnerAttestation) {
		requirementArray.push(GovernmentIssuedIdentification);
	}

	if ((isApplication || isAttestationAmendment) && !isOwnerAttestation) {
		// if full app, add all requirements
		if (!isTemporaryRequest) {
			requirementArray.push(BusinessTaxRegistrationCertificate);
			requirementArray.push(CannabisWasteManagementPlan);
			requirementArray.push(CommercialCannabisActivityPlan);
			requirementArray.push(DiversityPlan);
			requirementArray.push(FinancialInformation);
			requirementArray.push(FireSafetyPlan);
			requirementArray.push(HiringPlan);
			requirementArray.push(LaborPeaceAgreement);
			requirementArray.push(LimitedAccessAreasPlan);
			requirementArray.push(OrgChart);
			requirementArray.push(RadiusMap);
			requirementArray.push(SecurityPlan);
			requirementArray.push(StaffingPlan);
			if (isTesting) {
				requirementArray.push(ISO170325Accreditation);
				requirementArray.push(LaboratoryEmployeeQualifications);					
				requirementArray.push(SamplingPlansProceduresAndProtocols);
				requirementArray.push(StandardOperatingProcedures);
				requirementArray.push(TestingMethodologies);
			}
			if (isCultivation) {
				requirementArray.push(EnergyEfficiencyPlan);
			}
		} else {
			// only add temp requirements
			requirementArray.push(BusinessTaxRegistrationCertificate);
		}

	}

	logDebug("Num of Req Docs:" + requirementArray.length + " docs.");
	logDebug("All req docs: " + requirementArray);

	return requirementArray;
}
