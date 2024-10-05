import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';

const Shortlist = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [shortlistedFiles, setShortlistedFiles] = useState([]); // Change to array to store multiple shortlisted files

  useEffect(() => {
    // Retrieve the shortlisted files from local storage
    const files = localStorage.getItem('shortlistedFiles');
    if (files) {
      setShortlistedFiles(JSON.parse(files));
    }
  }, []);

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  const handleDelete = (path) => {
    // Filter out the deleted file and update local storage
    const updatedFiles = shortlistedFiles.filter(file => file.path !== path);
    setShortlistedFiles(updatedFiles);
    localStorage.setItem('shortlistedFiles', JSON.stringify(updatedFiles));
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
          {shortlistedFiles.length > 0 ? (
            <ul>
              {shortlistedFiles.map((file, index) => (
                <li key={index}>
                  <button onClick={() => handleFileClick(file.path)}>
                    {file.name}
                  </button>
                  <button onClick={() => handleDelete(file.path)} style={{ color: 'red' }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No shortlisted files found.</p>
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

export default Shortlist;
