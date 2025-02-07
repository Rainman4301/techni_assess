import { useState } from 'react'
import axios from 'axios'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'




function App() {
  const [file, setFile] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [regexPattern, setRegexPattern] = useState('');

  const handleProcess = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_input', userInput);

      const response = await axios.post('http://localhost:8000', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      });

      

      setProcessedData(response.data.processed_data);
    } 
    catch (error) {
      console.error('Processing error:', error);
      alert('Error processing file: ' + (error.response?.data?.error || error.message));
    } 
    finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1>Text Pattern Processor</h1>
      
      {/* File Upload */}
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

      {/* Combined Input */}
      <div className="input-section">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Example: Find email addresses in the Email column and replace them with 'REDACTED'"
          rows="3"
        />
      </div>

      {/* Process Button */}
      <button 
        onClick={handleProcess}
        disabled={!file || !userInput || isProcessing}
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
      {/* Display Regex Pattern */}
      {regexPattern && (
        <div className="regex-section">
          <h2>Regex Pattern</h2>
          <pre>{regexPattern}</pre>
        </div>
      )}
    </div>
  );
}

export default App;