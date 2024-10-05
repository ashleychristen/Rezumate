import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import ImageScatter from '../components/ImageScatter'; // Adjust the path if needed
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  // Declare the file state variable here
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState(''); // State for text input

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return; // This line checks if the file is defined

    const formData = new FormData();
    formData.append('pdf', file);

    // Send the file to the backend
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Upload successful:', data);
      // Optionally redirect to the New Documents page
      // window.location.href = '/new';
    } else {
      console.error('Upload failed');
    }
  };

  // Handle text input change
  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  // Handle submit for text input
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!textInput.trim()) return; // Prevent empty submissions

    try {
      const response = await fetch('/api/saveText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setTextInput(''); // Clear the text box after submission
      } else {
        console.error('Failed to save text');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="A website showcasing images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <h1 className={styles.title}>Welcome to your Resume Dashboard</h1>
      <p className={styles.description}>Check out the new, shortlisted, and rejected resumes!</p>
      
      {/* Image scatter component */}
      <div className={styles.imageContainer}>
        <ImageScatter />
      </div>

      {/* Flex Container for Upload and Text Section */}
      <div className={styles.flexContainer}>
        {/* PDF Upload Section */}
        <div className={styles.uploadSection}>
          <h2 className={styles.header}>Upload a Resume</h2>

          {/* Hidden file input */}
          <input
            type="file"
            accept=".pdf"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the default file input
          />

          {/* Custom upload button */}
          <label htmlFor="file-upload" className={styles.uploadButton}>
            Browse...
          </label>
          <span style={{ marginRight: '10px' }}></span>
          <button onClick={handleUpload} className={styles.uploadButton}>
            Upload PDF
          </button>
        </div>

        {/* Text Box Section */}
        <div className={styles.uploadSection}>
          <h2 className={styles.header2}>Add a Job Description</h2>
          <div className={styles.textBoxSection} style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
            <textarea
              value={textInput}
              onChange={handleTextChange}
              rows={4}
              cols={30}
              placeholder="Write your text here..."
              className={styles.textArea} // Add a CSS class for styling
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
              Submit
            </button>
          </div>
        </div>
      </div>
      
  </div>
  );
};

export default Dashboard;
