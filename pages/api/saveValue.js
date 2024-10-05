// pages/api/savevalue.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sliderValue, filename, filepathway } = req.body; // Get values from request body

    // Define the path where the CSV file will be saved
    const filePath = path.join(process.cwd(), 'values.csv');

    // Prepare the row to write to the CSV
    const row = [filename, filepathway, sliderValue].join(',') + '\n';

    // Append the row to the CSV file
    fs.appendFile(filePath, row, (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      // Respond with a success message
      res.status(200).json({ message: 'Slider value saved successfully' });
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
