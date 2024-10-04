import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const New = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(0); // State to manage slider value
  const [pdfFiles, setPdfFiles] = useState([]); // State to store fetched PDF files

  // Fetch uploaded PDF files on component mount
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const response = await fetch('/api/files'); // Fetch from the correct endpoint
      if (response.ok) {
        const data = await response.json();
        setPdfFiles(data); // Assuming your API returns an array of file objects
      } else {
        console.error('Failed to fetch files');
      }
    };
  
    fetchUploadedFiles();
  }, []);

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Header with Home button on the far left and title centered */}
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <Link href="/">
            <button className={styles.homeButton}>Home</button>
          </Link>
        </div>
        <div className={styles.centerSection}>
          <h1 className={styles.title}>New Documents</h1>
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
                <button onClick={() => handleFileClick(file.path)}>
                  {file.name}
                </button>
                {/* Add Shortlist and Reject Buttons */}
                <Link href={`/shortlist?filePath=${encodeURIComponent(file.path)}&fileName=${encodeURIComponent(file.name)}`}>
                  <button className={styles.shortlistButton}>Shortlist</button>
                </Link>
                <Link href={`/rejection?filePath=${encodeURIComponent(file.path)}&fileName=${encodeURIComponent(file.name)}`}>
                  <button className={styles.rejectButton}>Reject</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF Viewer on the right */}
        {selectedFile && (
          <div className={styles.pdfViewer}>
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
              step="1" // Step to only accept integers
              className={styles.slider}
            />
            <span>10</span>
          </div>
          <p>Current Value: {sliderValue}</p>
        </div>
      </div>
    </div>
  );
};

export default New;
