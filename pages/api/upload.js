// pages/api/upload.js

import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

// Configure API options
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ error: 'Something went wrong while uploading the file' });
    }

    // Log the uploaded files for debugging
    console.log('Uploaded files:', files);

    // Ensure the file field name matches your upload form
    const uploadedFile = files.pdf; // Make sure the field name matches your upload form

    if (!uploadedFile || !uploadedFile.filepath) {
      console.error('File path is undefined');
      return res.status(400).json({ error: 'No file uploaded or file path is undefined' });
    }

    const oldPath = uploadedFile.filepath;
    const tempDir = path.join('/tmp', uploadedFile.originalFilename); // Use /tmp for temporary storage

    // Copy the file to the temporary directory
    fs.copyFile(oldPath, tempDir, (copyErr) => {
      if (copyErr) {
        console.error('Error moving the file to temp:', copyErr);
        return res.status(500).json({ error: 'File upload failed' });
      }

      // Log success and return the file path
      console.log(`File uploaded successfully to ${tempDir}`);
      return res.status(200).json({ message: 'File uploaded successfully', path: tempDir });
    });
  });
};

export default uploadHandler;
