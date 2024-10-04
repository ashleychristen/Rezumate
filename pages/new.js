import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const New = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(0); // State to manage slider value

  const [pdfFiles, setPdfFiles] = useState([]);

  // Fetch uploaded PDF files
  const files = [
    { name: 'Resume 1', path: '/documents/ashley_resume.pdf' }, 
    { name: 'Resume 2', path: '/documents/john_resume.pdf' },
    { name: 'Cover Letter', path: '/documents/cover_letter.pdf' },
  ];

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  useEffect(() => {
    // Fetch the uploaded files or any other necessary data on component mount
    const fetchUploadedFiles = async () => {
      // Example: Fetch uploaded files if needed
      const response = await fetch('/api/getUploadedFiles'); // Assuming you have an API to fetch uploaded files
      const data = await response.json();
      setUploadedFiles(data); // Assuming your API returns an array of file objects
    };

    fetchUploadedFiles();
  }, []);

  
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
            {files.map((file, index) => (
              <li key={index}>
                <button onClick={() => handleFileClick(file.path)}>
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF Viewer on the right */}
        {selectedFile && (
          <div className={styles.pdfViewer}>
            <iframe
              src={selectedFile}
              width="1200"
              height="1000"
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
          </div>
        )}

        {/* Slider for rating */}
        <div className={styles.sliderContainer}>
          <label>SLIDE!!</label>
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
