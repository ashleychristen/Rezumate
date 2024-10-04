import fs from 'fs';
import path from 'path';

const files = (req, res) => {
  const directoryPath = path.join(process.cwd(), 'public/documents');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory: ' + err });
    }

    // Create an array of file paths
    const filePaths = files.map(file => `/documents/${file}`);
    res.status(200).json(filePaths);
  });
};

export default files;
