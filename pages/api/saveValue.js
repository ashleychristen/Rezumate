// pages/api/saveValue.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { value } = req.body;
        
      // You can save the value to a database or a file here.
      // For demonstration purposes, we'll just log it.
      console.log('Slider Value:', value);
  
      res.status(200).json({ message: 'Value saved successfully!' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  