import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js to parse the body
  },
};

const upload = (req, res) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong with the file upload.' });
    }

    const pdf = files.pdf; // Get the uploaded PDF file
    const uploadPath = path.join(process.cwd(), 'public/documents', pdf.name);

    // Move the file to the upload path
    fs.rename(pdf.path, uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed.' });
      }
      res.status(200).json({ message: 'File uploaded successfully', path: `/documents/${pdf.name}` });
    });
  });
};

export default upload;
