// pages/fileReader.js

import Link from 'next/link';
import styles from '../styles/file.module.css';
import { useEffect, useState } from 'react';

const FileReader = () => {
  const [files, setFiles] = useState([]); // State to hold file names

  useEffect(() => {
    const fetchFiles = async () => {
      // Fetch the list of files from the /tmp directory
      try {
        const response = await fetch('/api/getFiles'); // Ensure you have an API endpoint to list files
        if (response.ok) {
          const fileList = await response.json();
          setFiles(fileList);
        } else {
          console.error('Failed to fetch files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>File Reader</h1> {/* Use className for heading */}
      <ul className={styles.fileList}>
        {files.map((file, index) => (
          <li key={index}>
            <Link href={`/tmp/${file}`} target="_blank"> {/* Adjust the path if necessary */}
              {file}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileReader;
