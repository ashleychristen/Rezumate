import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/new.module.css';

const Shortlisted = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Array of files (you can adjust these paths)
  const files = [
    { name: 'Resume 1', path: '/documents/ashley_resume.pdf' }, 
    { name: 'Resume 2', path: '/documents/john_resume.pdf' },
    { name: 'Cover Letter', path: '/documents/cover_letter.pdf' },
  ];

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  return (
    <div className={styles.container}>
      {/* Title at the very top */}
      <h1 className={styles.title}>Shortlisted Documents</h1>

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
      </div>
    </div>
  );
};

export default Shortlisted;