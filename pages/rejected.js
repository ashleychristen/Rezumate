import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/new.module.css';
import Head from 'next/head';


const Rejected = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rejectedFiles, setRejectedFiles] = useState([]); // Change to array to store multiple rejected files

  useEffect(() => {
    // Retrieve the rejected files from local storage
    const files = localStorage.getItem('rejectedFiles');
    if (files) {
      setRejectedFiles(JSON.parse(files));
    }
  }, []);

  const handleFileClick = (path) => {
    setSelectedFile(path);
  };

  const handleDelete = (path) => {
    // Filter out the deleted file and update local storage
    const updatedFiles = rejectedFiles.filter(file => file.path !== path);
    setRejectedFiles(updatedFiles);
    localStorage.setItem('rejectedFiles', JSON.stringify(updatedFiles));
  };

  return (
    <div className={styles.container}>
        <Head>
        <title>Rejected Resumes</title>
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
          <h1 className={styles.title}>Rejected Resumes</h1>
        </div>
        <div className={styles.rightSection}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.buttonList}>
          {rejectedFiles.length > 0 ? (
            <ul>
              {rejectedFiles.map((file, index) => (
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
            <p>No rejected files found.</p>
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

export default Rejected;
