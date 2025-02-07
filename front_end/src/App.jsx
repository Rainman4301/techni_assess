import { useState } from 'react'
import axios from 'axios'
import './App.css'





// npm creat vite@latest
// react
// javascript


// √ Project name: ... full_stake_ass  
// √ Select a framework: » React       
// √ Select a variant: » JavaScript 

// cd full_stake_ass
// npm install





function App() {

  // These state variables store the file, user input, processed data,
  // loading status, and the regex pattern that gets returned from the backend.
  const [file, setFile] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [regexPattern, setRegexPattern] = useState('');


  // This function is triggered when the user clicks the "Process File" button.
  const handleProcess = async (e) => {


    e.preventDefault();
    setIsProcessing(true);
    
    try {

      // The file and userInput are packaged into formData (a special object that helps in sending files via HTTP requests).
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_input', userInput);

      // axios.post sends the data to the backend at http://localhost:8000
      const response = await axios.post('http://localhost:8000', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      });

      console.log('Regex Pattern:', regexPattern);  // Check if regexPattern is populated
      setRegexPattern(response.data.regex_pattern);
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
  
      {/* Display Regex Pattern */}
      {regexPattern ? (
        <div className="regex-section">
          <h2>Regex Pattern</h2>
          <pre>{regexPattern}</pre>
        </div>
      ) : (
        <div className="regex-section">
          <h2>No regex pattern generated yet</h2>
        </div>
      )}
  
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