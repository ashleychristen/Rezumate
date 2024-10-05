//this is meant to be in an App.jsx file idk why we don't have one?
//need to take csv file and be able to use it in the same format that const rawData is right now
//not sure how to do it.


import { useEffect, useState } from 'react';
//import './Dashboard.module.css';
import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip,ResponsiveContainer,Scatter} from 'recharts';
import regression from 'regression';
import styles from '../styles/Dashboard.module.css';


// Sample raw data

const rawData = [
  { ethnicity: 25, hire_score: 85, match: 25 },
  { ethnicity: 40, hire_score: 60, match: 35 },
  { ethnicity: 90, hire_score: 90, match: 65 },
  { ethnicity: 80, hire_score: 70, match: 80 },
  { ethnicity: 20, hire_score: 75, match: 10 },
  { ethnicity: 95, hire_score: 95, match: 90 },
  { ethnicity: 50, hire_score: 50, match: 45 },
  { ethnicity: 80, hire_score: 80, match: 50 },
  { ethnicity: 85, hire_score: 85, match: 95 },
  { ethnicity: 25, hire_score: 85, match: 30 },
  { ethnicity: 40, hire_score: 60, match: 35 },
  { ethnicity: 90, hire_score: 90, match: 65 },
  { ethnicity: 80, hire_score: 70, match: 80 },
  { ethnicity: 20, hire_score: 75, match: 20 },
  { ethnicity: 95, hire_score: 95, match: 90 },
  { ethnicity: 50, hire_score: 50, match: 45 },
  { ethnicity: 80, hire_score: 80, match: 50 },
  { ethnicity: 85, hire_score: 85, match: 95 },
];


function App() {

  // Get data from csv
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    // Parse CSV file into JSON
    const fetchData = async () => {
      const response = await fetch('./data/trial_biased5_pooled_match.csv'); // Provide the correct path to your CSV file
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          // Map through the parsed data to ensure the desired format
          const formattedData = result.data.map(item => ({

            name: item.Name, // Keep as string
            ethnicity: parseInt(item.Ethnicity), // Ensure integer
            gender: parseInt(item.Gender), // Keep as string
            resume_ID: item['Resume ID'], // Keep as string
            match: parseInt(item.Match), // Ensure integer
            length: parseInt(item.Length), // Keep as string (or convert if needed)
            education_Prestige: parseInt(item['Education Prestige']), // Keep as string (or convert if needed)
            gpa: parseInt(item.GPA), // Keep as string (or convert if needed)
            hire_score: parseInt(item['Hire Score']) // Ensure integer

          }));
          setRawData(formattedData); // Set the formatted data as the rawData state
          //setRawData(result.data); // Set the parsed data as the rawData state
        }
      });
    };
    
    fetchData();
  }, []);

  if (rawData.length === 0) {
    return <div>Loading...</div>; // Simple loading state until data is fetched
  }

  // Split data into groups based on match percentage
  const lowMatch = rawData.filter(d => d.match >= 0 && d.match < 30);
  const mediumMatch = rawData.filter(d => d.match >= 30 && d.match < 70);
  const highMatch = rawData.filter(d => d.match >= 70 && d.match <= 100);

  const generateRegressionLinePoints = (slope, intercept, data) => {
    const minEthnicity = Math.min(...data.map(d => d.ethnicity));
    const maxEthnicity = Math.max(...data.map(d => d.ethnicity));
  
    // Generate two points
    const point1 = { 
      ethnicity: minEthnicity, 
      hire_score: slope * minEthnicity + intercept 
    };
    const point2 = { 
      ethnicity: maxEthnicity, 
      hire_score: slope * maxEthnicity + intercept 
    };
  
    return [point1, point2];
  };


  const performRegression = (data) => {
    // Prepare data for regression
    const regressionData = data.map(item => [item.ethnicity, item.hire_score]);
    const result = regression.linear(regressionData);

    const slope = result.equation[0];  // First element is the slope
    const intercept = result.equation[1];  // Second element is the intercept

    // Generate regression line points
    const regressionLinePoints = generateRegressionLinePoints(slope, intercept, data);
    
    // Return regression points and r2 value (used as a proxy for p-value)
    return {
      points: result.points.map((point) => ({
        ethnicity: point[0], // Ethnicity as score
        hire_score: point[1], // Hire score predicted by regression
      })),
      data: data,
      r2: result.r2, // Coefficient of determination
      r: Math.sqrt(result.r2) * Math.sign(result.equation[0]), // Calculate Pearson correlation coefficient (r)
      slope: slope, // Slope of the regression line
      intercept: intercept, // Intercept of the regression line
      regressionLinePoints: regressionLinePoints // Points for the regression line
    };
  };

  // Perform regression for each group
  const lowMatchData = performRegression(lowMatch);
  const mediumMatchData = performRegression(mediumMatch);
  const highMatchData = performRegression(highMatch);

  return (
    <>
    {/* Button to go back to the home page */}
    <button className={styles.uploadButton} onClick={() => window.location.href = '/'}>
      Home
      </button>

      
      <h1 className={styles.title}>Ethnicity vs Hire Score Analysis</h1>

      
      {lowMatchData.r <= 0.05 && (
        <>
          <h4 className={styles.header3}>BIAS FOUND: Low Match (0-30%) - R: {lowMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lowMatchData.regressionLinePoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {lowMatchData.r > 0.05 && (
        <>
          <h4 className={styles.header3}>Low Match (0-30%) - R: {lowMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lowMatchData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      
      {mediumMatchData.r <= 0.05 && (
        <>
          <h4 className={styles.header3}>BIAS FOUND: Medium Match (30-70%) - R: {mediumMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mediumMatchData.regressionLinePoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {mediumMatchData.r > 0.05 && (
        <>
          <h4 className={styles.header3}>Medium Match (30-70%) - R: {mediumMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mediumMatchData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      
      {highMatchData.r <= 0.05 && (
        <>
          <h4 className={styles.header3}>BIAS FOUND: High Match (70-100%) - R: {highMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={highMatchData.regressionLinePoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {highMatchData.r > 0.05 && (
        <>
          <h4 className={styles.header3}>High Match (70-100%) - R: {highMatchData.r.toFixed(2)}</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={highMatchData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ethnicity" type="number" domain={[0, 100]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hire_score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}

export default App;
