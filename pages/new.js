import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const New = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        setPdfFiles(data);
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

  const handleShortlist = (file) => {
    localStorage.setItem('shortlistedFile', JSON.stringify(file));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <Link href="/">
            <button className={styles.homeButton}>Home</button>
          </Link>
        </div>
        <div className={styles.centerSection}>
          <h1 className={styles.title}>New Documents</h1>
        </div>
        <div className={styles.rightSection}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.buttonList}>
          <ul>
            {pdfFiles.map((file, index) => (
              <li key={index}>
                <button onClick={() => handleFileClick(file.path)}>
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

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

            {/* Shortlist button directly below the slider */}
            {selectedFile && (
                <button
                onClick={() => handleShortlist({ name: selectedFile.split('/').pop(), path: selectedFile })}
                className={styles.shortlistButton}
                >
                Shortlist
                </button>
            )}
            </div>


      </div>
    </div>
  );
};

export default New;
