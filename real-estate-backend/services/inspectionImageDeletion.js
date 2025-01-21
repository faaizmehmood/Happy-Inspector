import { deleteImagesFromCloudinary } from "./imageService.js";
import inspectionModel from "../models/inspectionModel.js";

// Function to delete all images within an inspection
// export const handleInspectionDeletion = async (inspectionId) => {

//   try
//   {
//     var imagePublicIds = [];
//     const inspection = await inspectionModel.findById(inspectionId);
//     if (!inspection) {
//       return;
//     }
  
//     // Get all Room Images, Element Images into the imagePublicIds array
//     inspection.rooms.forEach(room => {
//       room.image.forEach(image => {
//         imagePublicIds.push(image.publicId);
//       });
  
//       room.elements.forEach(element => {
//         if (element.image && element.image.publicId && element.image.publicId !== "") {
//           imagePublicIds.push(element.image.publicId);
//         }
//       });
//     });

//     // Get all Collaborator Signatures into the imagePublicIds array
//     inspection.collaborators.forEach(collaborator => {
      
//       if (collaborator.signature && collaborator.signature.publicId && collaborator.signature.publicId !== "") 
//       {
//         imagePublicIds.push(collaborator.signature.publicId);
//       }
//     });
  
//     // Get Inspector Signature into the imagePublicIds array
//     if (inspection.inspectorSignature && inspection.inspectorSignature.publicId && inspection.inspectorSignature.publicId !== "") {
//       imagePublicIds.push(inspection.inspectorSignature.publicId);
//     }

//     // Get all PDFs into the imagePublicIds array
//     if (inspection.pdfReportUrl && inspection.pdfReportUrl.publicId && inspection.pdfReportUrl.publicId !== "") {
//       imagePublicIds.push(inspection.pdfReportUrl.publicId);
//     }
  
//     // Delete all images from Cloudinary
//     const {success, message} = await deleteImagesFromCloudinary(imagePublicIds);
//     if (!success) {
//       return { success: false, message: message };
//     }

//     //Delete the inspection
//     await inspectionModel.findByIdAndDelete(inspectionId);

//     return { success: true, message: "Images deleted successfully" };
  
//   }
//   catch (err) {
//     return { success: false, message: err.message };
//   }
// };
