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
	var isMedical = appMatch("Licenses/Medical Cannabis/*/*");
	var isAdultUse = appMatch("Licenses/Adult Use Cannabis/*/*");
	var isCannabis = appMatch("Licenses/Cannabis/*/*"); // combined

	var isApplication = appMatch("Licenses/*/*/Application");
	var isRenewal = appMatch("Licenses/*/*/Renewal");
	var isOwner = appMatch("Licenses/*/*/Owner Submittal");

	var isDispensary = appMatch("Licenses/*/Dispensary/*"); // No longer exists
	var isProducingDispensary = appMatch("Licenses/*/Producing Dispensary/*"); // No longer exists
	var isDistributor = appMatch("Licenses/*/Distributor/*");  // Type A11, M11
	var isTesting = appMatch("Licenses/*/Testing/*");  // Type 8
	var isTransporter = appMatch("Licenses/*/Transporter/*"); // No longer exists
	var isRetailer = appMatch("Licenses/*/Retailer/*"); // Type A10, M10
	var isRetailerNonStore = appMatch("Licenses/*/Retailer Nonstorefront/*");  // Type A9, M9
	var isMicroBusiness = appMatch("Licenses/*/Microbusiness/*");  // Type A12, M12
	var isDistribTransportOnly = appMatch("Licenses/*/Distributor-Transport Only/*");  // Type A13, M13
	var isDeficiency = appMatch("Licenses/*/*/Attestation Deficiency");

	/*------------------------------------------------------------------------------------------------------/
	| Load up Standard Conditions :
	/------------------------------------------------------------------------------------------------------*/
	var businessFormationDocuments = {
		condition: "Business Formation Documents",
		document: "Business Formation Documents"
	}; // 5006(b)(15)
	var financialInformation = {
		condition: "Financial Information",
		document: "Financial Information"
	}; // 5006(b)(18)
	var documentationOfLocalCompliance = {
		condition: "Documentation of Local Compliance",
		document: "Documentation of Local Compliance"
	}; // 5006(b)(23)
	var laborPeaceAgreement = {
		condition: "Labor Peace Agreement",
		document: "Labor Peace Agreement"
	}; // 5006(b)(26)
	var waiverOfSovereignImmunity = {
		condition: "Waiver of Sovereign Immunity",
		document: "Waiver of Sovereign Immunity"
	}; // 5006(b)(33)
	var evidenceOfLegalRightToOccupy = {
		condition: "Evidence of Legal Right to Occupy",
		document: "Evidence of Legal Right to Occupy"
	}; // 5006(b)(24)
	var proofOfSuretyBond = {
		condition: "Proof of Surety Bond",
		document: "Proof of Surety Bond"
	}; // 5006(b)(28)
	var diagramOfPremises = {
		condition: "Diagram of Premises",
		document: "Diagram of Premises"
	}; // 5006(b)(28)
/* no longer used see story 2062
	var operatingProceduresDistrib = {
		condition: "Operating Procedures - Distribution",
		document: "Operating Procedures"
	}; // 5006(b)(30)
	var operatingProceduresTransport = {
		condition: "Operating Procedures - Transport",
		document: "Operating Procedures"
	}; // 5006(b)(31)
	var operatingProceduresDispense = {
		condition: "Operating Procedures - Dispensary",
		document: "Operating Procedures"
	}; // 5006(b)(32)
	var operatingProceduresMicro = {
		condition: "Operating Procedures - MicroBusiness",
		document: "Operating Procedures"
	}; // AUMA regs
	var operatingProceduresTesting = {
		condition: "Operating Procedures - Testing",
		document: "Operating Procedures"
	}; // 5292 (a)
*/
	var labEmployeeQualifications = {
		condition: "Laboratory Employee Qualifications",
		document: "Laboratory Employee Qualifications"
	}; // 5238(b)
	var proofOfIsoAccreditationStatus = {
		condition: "Proof of ISO Accreditation Status",
		document: "Proof of ISO Accreditation Status"
	}; // 5238(b)
	var submittedFingerPrintImages = {
		condition: "Submitted Application for Fingerprint Images",
		document: "Submitted Application for Fingerprint Images"
	}; // 5238(b)
	var governmentIssuedIdentification = {
		condition: "Government-Issued Identification",
		document: "Government-Issued Identification"
	}; // 5238(b)
	var descriptionOfConvictions = {
		condition: "Description of Convictions",
		document: "Description of Convictions"
	}; // 5238(b)
	var proofOfMilitaryStatus = {
		condition: "Proof of Military Status",
		document: "Proof of Military Status"
	}; // 5006(b)(4)
	var priorityProcessingRequest = {
		condition: "Priority Processing Request",
		document: "Priority Processing Request"
	};
	var temporaryLicenseRequest = {
		condition: "Temporary License Request",
		document: "Temporary License Request"
	};
	var proofOfInsurance = {
		condition: "Proof of Commercial General Liability Insurance",
		document: "Proof of Commercial General Liability Insurance"
	};

	var transportationProcess = {condition: "Transportation Process",document: "Transportation Process"	};
	var inventoryProcedures = { condition: "Inventory Procedures",document: "Inventory Procedures"	};
	var qualityControlProcedures = {condition: "Quality Control Procedures",document: "Quality Control Procedures"	};
	var securityProtocols = { condition: "Security Protocols",document: "Security Protocols"	};
	var samplingStandards = {condition: "Sampling Standards",document: "Sampling Standards"	};
	var chainOfCustodyProtocol = { condition: "Chain of Custody Protocol",document: "Chain of Custody Protocol"	};
	var labAnalysesStandard = {condition: "Laboratory Analyses Standard",document: "Laboratory Analyses Standard"	};
	var testingMethods = { condition: "Testing Methods",document: "Testing Methods"	};

	/*------------------------------------------------------------------------------------------------------/
	| Load up Conditionals from Record
	/------------------------------------------------------------------------------------------------------*/
	var isLargeEmployer = isASITrue(AInfo["20 or more employees?"]); // see user story 5135
	var isWaivingSovereignImmunity = isASITrue(AInfo["Are they Sovereign Entity"]); // see user story 5135, 1890
	var isPriorityRequest = isASITrue(AInfo["Are you requesting priority processing?"]); // see user story 340
	var isTemporaryRequest = isASITrue(AInfo["Are you requesting a temporary license?"]); // see user story 340

	var hasDistributorTransportOnlyActivity = isASITrue(AInfo["Distributor-Transport Only"]); // see user story 2079
	var hasDistributorActivity = isASITrue(AInfo["Distributor"]); // see user story 2079


	var isCriminal = false;
	var isSoleOwner = false;
	isMilitary = isASITrue(AInfo["Military Service"]);

	var ownerApplicant = getContactObj(capToUse, "Owner Applicant");
	if (ownerApplicant && ownerApplicant.asi) {
		isCriminal = isASITrue(ownerApplicant.asi["Criminal Convictions"]);
	}

	var businessOwner = getContactObj(capToUse, "Business Owner");
	if (businessOwner && businessOwner.asi) {
		isCriminal = isASITrue(businessOwner.asi["Criminal Convictions"]);

	}

	var business = getContactObj(capToUse, "Business");
	if (business && business.asi) {
		isSoleOwner = business.asi["5006(b)(14) Business Organization Structure"] == "Sole Owner";
	}

	/*------------------------------------------------------------------------------------------------------/
	| Business Rules : NEEDS REVIEW, map variables to standard condition
	/------------------------------------------------------------------------------------------------------*/
	if (isOwner) {
		// removed requirement 5/24 after sprint story acceptance per Connie
		//requirementArray.push(submittedFingerPrintImages);
		requirementArray.push(governmentIssuedIdentification);

		if (isCriminal) {
			// Removed doc requirement per Connie 5/24 sprint acceptance meeting
			// requirementArray.push(descriptionOfConvictions);
		}
	}

	if (isOwner) {
		if (isMilitary) {
			requirementArray.push(proofOfMilitaryStatus);
		}
	}

	if (isApplication) {
		// exclude items not needed for temp applications as submitted in ACA
		if (isPageFlow && isTemporaryRequest) {
			requirementArray.push(documentationOfLocalCompliance);
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
		} else {
			//requirementArray.push(documentationOfLocalCompliance); only required for temp
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
			requirementArray.push(proofOfSuretyBond); //not needed for temp
			requirementArray.push(financialInformation); //not needed for temp
		}

		if (isPriorityRequest) {
			requirementArray.push(priorityProcessingRequest);
		}

		//if (isTemporaryRequest) {
		//	requirementArray.push(temporaryLicenseRequest);
		//}

		if (!isTemporaryRequest) {
			requirementArray.push(businessFormationDocuments);
		}

		if (isLargeEmployer) {
			requirementArray.push(laborPeaceAgreement);
		}

		if (isWaivingSovereignImmunity) {
			requirementArray.push(waiverOfSovereignImmunity);
		}

		if (isDistributor || isRetailer || isRetailerNonStore || isMicroBusiness || isDistribTransportOnly) { 
			// exclude items not needed for temp applications as submitted in ACA
			if (isPageFlow && isTemporaryRequest) {
				//nothing to do here
			} else {
				// user story 2062
				requirementArray.push(transportationProcess);
				requirementArray.push(inventoryProcedures);
				requirementArray.push(qualityControlProcedures);
				requirementArray.push(securityProtocols);			}
		}

		if (isTesting) {
			// exclude items not needed for temp applications as submitted in ACA
			if (isPageFlow && isTemporaryRequest) {
				//nothing to do here
			} else {
				//requirementArray.push(operatingProceduresTesting);
				//removed in user story 1604
				//requirementArray.push(labEmployeeQualifications);
				// user story 2062
				requirementArray.push(proofOfIsoAccreditationStatus);
				requirementArray.push(labAnalysesStandard);
				requirementArray.push(chainOfCustodyProtocol);
				requirementArray.push(testingMethods);
				requirementArray.push(samplingStandards);
				}
		}

		if (isDistributor || isDistribTransportOnly || (isMicroBusiness && (hasDistributorActivity || hasDistributorTransportOnlyActivity))) {
				// exclude items not needed for temp applications as submitted in ACA
			if (isPageFlow && isTemporaryRequest) {
				//nothing to do here
			} else {
				//use story 2079
				requirementArray.push(proofOfInsurance);
			}
	}

	}
	logDebug("Num of Req Docs:" + requirementArray.length + " docs.");
	logDebug("All req docs: " + requirementArray);

	return requirementArray;
}
