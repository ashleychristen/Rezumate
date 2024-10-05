import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const Shortlisted = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [shortlistedFile, setShortlistedFile] = useState(null);

  useEffect(() => {
    // Retrieve the shortlisted file from local storage
    const file = localStorage.getItem('shortlistedFile');
    if (file) {
      setShortlistedFile(JSON.parse(file));
    }
  }, []);

  const handleFileClick = (path) => {
    setSelectedFile(path);
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
          <h1 className={styles.title}>Shortlisted Documents</h1>
        </div>
        <div className={styles.rightSection}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.buttonList}>
          {shortlistedFile && (
            <ul>
              <li>
                <button onClick={() => handleFileClick(shortlistedFile.path)}>
                  {shortlistedFile.name}
                </button>
              </li>
            </ul>
          )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortlisted;
