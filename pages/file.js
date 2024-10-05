// pages/fileReader.js

import Link from 'next/link';

const FileReader = () => {
  // Array of files (this can be dynamically generated in the future)
  const files = [
    { name: 'Resume 1', path: '/documents/ashley_resume.pdf' },
  ];

  return (
    <div>
      <h1>File Reader</h1>
      <ul>
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
