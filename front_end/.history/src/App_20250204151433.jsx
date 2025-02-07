import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'







import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [patternDescription, setPatternDescription] = useState('');
  const [replacementValue, setReplacementValue] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append('file', file);

      // Step 2: Send processing request
      const response = await axios.post('http://localhost:8000/api/process/', {
        file,
        pattern_description: patternDescription,
        replacement_value: replacementValue
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProcessedData(response.data.processed_data);
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error processing file: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1>Text Pattern Processor</h1>
      
      {/* File Upload Section */}
      <div className="upload-section">
        <label className="file-input-label">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? file.name : "Choose CSV/Excel File"}
        </label>
      </div>

      {/* Pattern Input Section */}
      <div className="pattern-section">
        <input
          type="text"
          placeholder="Describe pattern to match (e.g., 'find email addresses')"
          value={patternDescription}
          onChange={(e) => setPatternDescription(e.target.value)}
          className="pattern-input"
        />
        
        <input
          type="text"
          placeholder="Replacement value (e.g., 'REDACTED')"
          value={replacementValue}
          onChange={(e) => setReplacementValue(e.target.value)}
          className="replacement-input"
        />
      </div>

      {/* Process Button */}
      <button 
        onClick={handleFileUpload}
        disabled={!file || !patternDescription || isProcessing}
        className="process-button"
      >
        {isProcessing ? 'Processing...' : 'Process File'}
      </button>

      {/* Results Display */}
      {processedData && (
        <div className="results-section">
          <h2>Processed Results</h2>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  {Object.keys(processedData[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;       