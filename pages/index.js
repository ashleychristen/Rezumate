import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import ImageScatter from '../components/ImageScatter'; // Adjust the path if needed
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  // Declare the file state variable here
  const [file, setFile] = useState(null);

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

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="A website showcasing images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <h1 className={styles.title}>Welcome to your Dashboard</h1>
      <p className={styles.description}>Here are some images you can click:</p>
      
      {/* Image scatter component */}
      <div className={styles.imageContainer}>
        <ImageScatter />
      </div>

      {/* PDF Upload Section */}
      <div className={styles.uploadSection}>
        <h2 className={styles.header}>Upload a PDF</h2>

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

      {/* Image display */}
      <div className={styles.imageContainer}>
        <Image
          src="/images/graphs.jpg"
          alt="graphs"
          width={1500}
          height={500}
          priority
        />
      </div>
    </div>
  );
};

export default Dashboard;
