import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';
import { createPDF } from './pdfGeneration.js';
import inspectionModel from '../models/inspectionModel.js';

const generateAndUploadPDF = async (inspectionId, inspectionName, inspectionAddress, inspectionDate, rooms, inspectorName, inspectorRole, inspectorSignature, collaborators, folderpath) => {
    const filePath = path.join(process.cwd(), 'uploads', `pdf-${Date.now()}.pdf`);
    try {

      var addressString = inspectionAddress.unit + " " + inspectionAddress.street + ", " + inspectionAddress.city + ", " + inspectionAddress.state + " " + inspectionAddress.zip + ", " + inspectionAddress.country;
      const newInspectionDate = new Date(inspectionDate); // Create a Date object
      const currentDate = new Date();

      // Define options for toLocaleString
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'America/New_York', // Set your desired time zone
      };

      // Format the date
      const finalInspectionDate = newInspectionDate.toLocaleString('en-US', options) + ' EST';
      const finalCurrentDate = currentDate.toLocaleString('en-US', options) + ' EST';

      console.log('Generating PDF...');

      await createPDF(filePath, rooms, inspectionName, addressString, finalInspectionDate, finalCurrentDate, inspectorName, inspectorRole, inspectorSignature, collaborators);

      console.log('PDF generated successfully');
  
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw',
        folder: `${folderpath}`, // Specify your custom folder here
      });

      console.log('PDF uploaded successfully');

      await inspectionModel.findByIdAndUpdate(inspectionId, {
        pdfReportGenerated: true,
        // pdfReportUrl: { url: result.secure_url, publicId: result.public_id },
        pdfReportUrl: [...pdfReportUrl, { url: result.secure_url, publicId: result.public_id }],
      });

     const pdfBuffer = fs.readFileSync(filePath);

     fs.unlinkSync(filePath);

      return { pdfBuffer, pdfUrl: result.secure_url };
    } catch (err) {
      console.log(err);
      throw Error(err);
    } 
};


export default generateAndUploadPDF;