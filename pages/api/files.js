import fs from 'fs';
import path from 'path';

const filesHandler = (req, res) => {
  const directoryPath = path.join(process.cwd(), 'public/documents');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory: ' + err });
    }

    const pdfFiles = files.map(file => ({
      name: file,
      path: `/documents/${file}` // Serve files from public/documents
    }));

    res.status(200).json(pdfFiles);
  });
};

export default filesHandler;
