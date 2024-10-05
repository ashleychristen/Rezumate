import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';
import Head from 'next/head';

const New = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null); // State to track the active PDF button

  // Fetch uploaded PDF files on component mount
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const response = await fetch('/api/files'); // Fetch from the correct endpoint
      if (response.ok) {
        const data = await response.json();
        setPdfFiles(data);
      } else {
        console.error('Failed to fetch files');
      }
    };
  
    fetchUploadedFiles();
  }, []);

  const handleFileClick = (file) => {
    setSelectedFile(file.path);
    setActiveFile(file.name); // Set the active file
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleSubmit = async () => {
    // Prepare the data to be sent, including filename and filepathway
    const data = {
      sliderValue,
      filename: selectedFile ? selectedFile.split('/').pop() : '', // Extract the file name
      filepathway: selectedFile || '', // Send the full file path
    };
  
    try {
      const response = await fetch('/api/savevalue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        console.error('Failed to save slider value');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header with Home button on the far left and title centered */}
      <Head>
        <title>New Resumes</title>
        <meta name="description" content="A website showcasing images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <Link href="/">
            <button className={styles.homeButton}>Home</button>
          </Link>
        </div>
        <div className={styles.centerSection}>
          <h1 className={styles.title}>New Resumes</h1>
        </div>
        <div className={styles.rightSection}></div> {/* Placeholder to balance flexbox */}
      </div>

      {/* Content area with buttons and PDF viewer */}
      <div className={styles.content}>
        {/* File buttons on the left */}
        <div className={styles.buttonList}>
          <ul>
            {pdfFiles.map((file, index) => (
              <li key={index}>
                <button
                  onClick={() => handleFileClick(file)} // Pass the whole file object
                  className={activeFile === file.name ? styles.activeButton : styles.pdfButton} // Change class based on active state
                >
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF Viewer on the right */}
        {selectedFile && (
          <div className={styles.pdfViewer}>
            <h3>Currently Reading: {pdfFiles.find(file => file.path === selectedFile)?.name}</h3> {/* Displaying the name of the selected PDF */}
            <iframe
              src={selectedFile}
              width="1100"
              height="1000"
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
          </div>
        )}

        {/* Slider for rating */}
        <div className={styles.sliderContainer}>
          <label>How well would you rate this resume?</label>
          <div>
            <span>0</span>
            <input
              type="range"
              min="0"
              max="10"
              value={sliderValue}
              onChange={handleSliderChange}
              step="1"
              className={styles.slider}
            />
            <span>10</span>
          </div>
          <p>Current Value: {sliderValue}</p>

          {/* Submit Button */}
          <button onClick={handleSubmit} className={styles.submitButton}>
            Submit
          </button>

          {/* Shortlist and Reject buttons, directly under the slider */}
          <button
            className={styles.shortlistButton}
            onClick={() => {
              console.log(`Shortlisted: ${selectedFile}`);

              // Retrieve current shortlisted files from local storage
              const currentShortlistedFiles = JSON.parse(localStorage.getItem('shortlistedFiles')) || [];
              
              // Check if the file is already shortlisted
              const fileExists = currentShortlistedFiles.some(file => file.path === selectedFile);
              
              if (!fileExists) {
                // Add the new shortlisted file to the list
                currentShortlistedFiles.push({ name: selectedFile, path: selectedFile });

                // Save updated list back to local storage
                localStorage.setItem('shortlistedFiles', JSON.stringify(currentShortlistedFiles));

                // Remove from rejected files if it exists
                const currentRejectedFiles = JSON.parse(localStorage.getItem('rejectedFiles')) || [];
                const updatedRejectedFiles = currentRejectedFiles.filter(file => file.path !== selectedFile);
                localStorage.setItem('rejectedFiles', JSON.stringify(updatedRejectedFiles));
              } else {
                console.log("File is already shortlisted.");
              }
            }}
          >
            Shortlist
          </button>

          <button
            className={styles.rejectButton}
            onClick={() => {
              console.log(`Rejected: ${selectedFile}`);

              // Retrieve current rejected files from local storage
              const currentRejectedFiles = JSON.parse(localStorage.getItem('rejectedFiles')) || [];

              // Check if the file is already rejected
              const fileExists = currentRejectedFiles.some(file => file.path === selectedFile);

              if (!fileExists) {
                // Add the new rejected file to the list
                currentRejectedFiles.push({ name: selectedFile, path: selectedFile });
                localStorage.setItem('rejectedFiles', JSON.stringify(currentRejectedFiles));

                // Remove from shortlisted files if it exists
                const currentShortlistedFiles = JSON.parse(localStorage.getItem('shortlistedFiles')) || [];
                const updatedShortlistedFiles = currentShortlistedFiles.filter(file => file.path !== selectedFile);
                localStorage.setItem('shortlistedFiles', JSON.stringify(updatedShortlistedFiles));
              } else {
                console.log("File is already rejected.");
              }
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default New;
