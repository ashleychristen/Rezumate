// pages/api/getFiles.js

import fs from 'fs';
import path from 'path';

const getFiles = (req, res) => {
  const tempDir = '/tmp'; // Path to the /tmp directory

  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error('Error reading files:', err);
      return res.status(500).json({ error: 'Unable to read files' });
    }

    // Return the filenames as a JSON response
    return res.status(200).json(files);
  });
};

export default getFiles;
