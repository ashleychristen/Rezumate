// pages/fileReader.js

import Link from 'next/link';
import styles from '../styles/file.module.css';

const FileReader = () => {
  // Array of files (can be dynamically generated)
  const files = [
    { name: 'Resume 1', path: '/documents/ashley_resume.pdf' },
  ];

  return (
    <div className={styles.container}>
      <h1>File Reader</h1>
      <ul className={styles.fileList}>
        {files.map((file, index) => (
          <li key={index}>
            <Link href={file.path} target="_blank">
              {file.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileReader;
