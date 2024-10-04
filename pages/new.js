import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const New = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);

  const files = [
    { name: 'Resume 1', path: '/documents/ashley_resume.pdf' }, 
    { name: 'Resume 2', path: '/documents/john_resume.pdf' },
    { name: 'Cover Letter', path: '/documents/cover_letter.pdf' },
  ];

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>New Documents</h1>

      <div className={styles.content}>
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

        {selectedFile && (
          <div className={styles.pdfViewer}>
            <iframe
              src={selectedFile}
              width="1200"
              height="1000"
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
            <div className={styles.sliderContainer}>
              <label className={styles.sliderText}>SLIDE!!</label>
              <input
                type="range"
                min="0"
                max="10"
                value={sliderValue}
                onChange={handleSliderChange}
                className={styles.slider}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;
