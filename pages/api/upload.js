import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

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

    // Log the uploaded files
    console.log('Uploaded files:', files);

    // Access the first file in the array (adjust the field name if necessary)
    const uploadedFile = files.pdf[0];

    if (!uploadedFile || !uploadedFile.filepath) {
      console.error('File path is undefined');
      return res.status(400).json({ error: 'No file uploaded or file path is undefined' });
    }

    const oldPath = uploadedFile.filepath;
    const targetDir = path.join(process.cwd(), 'public/documents'); // Adjusted to use process.cwd()
    const newPath = path.join(targetDir, uploadedFile.originalFilename); // Correctly construct the new path

    // Check if the target directory exists; if not, create it
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy the file instead of renaming
    fs.copyFile(oldPath, newPath, (copyErr) => {
      if (copyErr) {
        console.error('Error moving the file:', copyErr);
        return res.status(500).json({ error: 'File upload failed' });
      }
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  });
};

export default uploadHandler;
