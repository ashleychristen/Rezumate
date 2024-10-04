import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from '../styles/new.module.css';

const Shortlisted = () => {
  const router = useRouter(); // Initialize useRouter
  const { filePath, fileName } = router.query; // Destructure filePath and fileName from the query

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
          <h1 className={styles.title}>Shortlisted Documents</h1>
        </div>
        <div className={styles.rightSection}></div> {/* Placeholder to balance flexbox */}
      </div>

      {/* Content area with buttons and PDF viewer */}
      <div className={styles.content}>
        {/* Display the selected file information */}
        {filePath && fileName ? (
          <div>
            <h2>Selected File: {fileName}</h2>
            {/* PDF Viewer */}
            <div className={styles.pdfViewer}>
              <iframe
                src={filePath}
                width="1200"
                height="1000"
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </div>
          </div>
        ) : (
          <p>No file selected.</p> // Message if no file is selected
        )}
      </div>
    </div>
  );
};

export default Shortlisted;
