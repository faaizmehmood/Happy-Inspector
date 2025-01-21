import cloudinary from '../config/cloudinary.js';

// Service to upload an image to Cloudinary
export const uploadImageToCloudinary = async (file, folderpath) => {
  try {
    // Uploading the image to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: `real-estate-app/${folderpath}`,
      format: 'png', // Format of the image to be uploaded
    });

    return {
      public_id: result.public_id, // Saving this for future reference (like deletion)
      url: result.secure_url, // This URL can be stored in the DB or returned to the frontend
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

// Service to delete an image from Cloudinary
export const deleteImageFromCloudinary = async (public_id) => {
  try {
    console.log('Deleting image with public_id:', public_id);
    // Deleting the image using its public_id
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image');
    }

    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Image deletion failed');
  }
};

// Service to delete multiple images from Cloudinary
export const deleteImagesFromCloudinary = async (public_ids) => {
  try {
    const deletePromises = public_ids.map(public_id => 
      cloudinary.uploader.destroy(public_id).then(result => {
        if (result.result !== 'ok') {
          throw new Error(`Failed to delete image with public_id: ${public_id}`);
        }
        return { success: true, public_id, message: 'Image deleted successfully' };
      })
    );

    // Wait for all deletion promises to resolve
    const results = await Promise.all(deletePromises);
    return { success: true, results };
    
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    return { success: false, message: error.message };
  }
};

async function deleteCloudinaryFolder(folderPath) {
  try {
    // Step 1: Delete all files in the folder
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    // Step 2: Delete the empty folder
    await cloudinary.api.delete_folder(folderPath);

    console.log(`Folder '${folderPath}' and all its files were successfully deleted.`);
  } catch (error) {
    console.error("Error deleting folder:", error.message);
  }
}

