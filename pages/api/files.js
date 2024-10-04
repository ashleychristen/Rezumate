import fs from 'fs';
import path from 'path';

const files = (req, res) => {
  const directoryPath = path.join(process.cwd(), 'public/documents');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory: ' + err });
    }

    // Filter to include only PDF files and create an array of file objects
    const pdfFiles = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        name: file, // Use the file name
        path: `/documents/${file}`, // Construct the file path
      }));

    res.status(200).json(pdfFiles); // Respond with the PDF file list
  });
};

export default files;
