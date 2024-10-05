// pages/api/saveText.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;
    
    // Define the path for the text file
    const filePath = path.join(process.cwd(), 'uploads', 'userInput.txt'); // Make sure the 'uploads' folder exists

    // Append the text to the file
    fs.writeFile(filePath, text + '\n', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving text' });
      }
      res.status(200).json({ message: 'Text saved successfully' });
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
