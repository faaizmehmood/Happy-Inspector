export const pdfEligibilityOrAllSigned = async (inspection) => {
    
    if (!inspection) {
        return "Inspection not found";
    }
    else if (inspection.pdfReportGenerated) {
        return "PDF already generated";
    }

    //check if inspector has signed and all collaborators have signed
    if (!inspection.inspectorSignature || !inspection.inspectorSignature.url || inspection.inspectorSignature.url === "") {
        return "Inspector has not signed";
    }
    else if (inspection.collaborators.length > 0) {
        for (let i = 0; i < inspection.collaborators.length; i++) {
            if (inspection.collaborators[i].signature) {
                if (inspection.collaborators[i].signature.url === "" || inspection.collaborators[i].signature.publicId === "") {
                    return "Collaborator has not signed";
                }
            }
            else {
                return "Collaborator has not signed";
            }

        }
    }
    
    return "true";
};