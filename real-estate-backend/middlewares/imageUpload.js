import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Define storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'; // Ensure this directory exists
    fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if it doesn't exist
    cb(null, uploadDir); // Set the destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname); // Ensure unique filenames
    cb(null, uniqueSuffix); // Save with a unique name
  },
});

// Set file size limit and file storage
const upload = multer({
  storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB file size limit
}).single('image'); // Ensure this matches the frontend form field

export default upload;

