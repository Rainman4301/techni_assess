import { useState } from 'react'
// import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'








function App() {
  const [file, setFile] = useState(null)
  const [naturalLanguage, setNaturalLanguage] = useState('')
  const [replacement, setReplacement] = useState('')
  const [processedData, setProcessedData] = useState(null)

  const handleFileUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Upload file
      const uploadResponse = await axios.post('http://localhost:8000/api/upload/', formData)
      
      // Process file
      const processResponse = await axios.post('http://localhost:8000/api/process/', {
        file_path: uploadResponse.data.file_path,
        column: 'Email',  // Dynamic column selection needed
        natural_language: naturalLanguage,
        replacement: replacement
      })

      setProcessedData(processResponse.data.processed_data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>Regex Processor</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Describe pattern (e.g., 'find email addresses')"
          value={naturalLanguage}
          onChange={(e) => setNaturalLanguage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Replacement value"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
        />
        <button type="submit">Process</button>
      </form>

      {processedData && (
        <table>
          <thead>
            <tr>
              {Object.keys(processedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
