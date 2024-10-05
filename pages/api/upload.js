import fs from 'fs';
import formidable from 'formidable';

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

    // Access the first file in the array
    const uploadedFile = files.pdf[0];

    if (!uploadedFile || !uploadedFile.filepath) {
      console.error('File path is undefined');
      return res.status(400).json({ error: 'No file uploaded or file path is undefined' });
    }

    const oldPath = uploadedFile.filepath;
    const newPath = `public/documents/${uploadedFile.originalFilename}`;

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error moving the file:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  });
};

export default uploadHandler;
