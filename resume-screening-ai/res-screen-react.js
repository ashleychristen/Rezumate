import React, { useState } from 'react';
import axios from 'axios';

const ResumeScreening = () => {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (resume) {
      const formData = new FormData();
      formData.append('resume', resume);
      const jsonData = JSON.stringify({ job_description: jd, resume: resume });

      try {
        const res = await axios.post('/api/analyze', jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setResponse(res.data.response);
      } catch (error) {
        console.error('Error submitting the resume:', error);
      }
    }
  };

  return (
    <div>
      <h1>Resume Screening AI</h1>
      <p>AI Component to Understand Resumes</p>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste the Job Description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {response && <h2>{response}</h2>}
    </div>
  );
};

export default ResumeScreening;
