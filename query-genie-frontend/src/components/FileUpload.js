import React, { useState } from 'react';
import styled from 'styled-components';

const UploadButton = styled.button`
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QueryInput = styled.input`
  display: block;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled(UploadButton)`
  margin-top: 5px;
`;

const OutputContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [query, setQuery] = useState('');
  const [csvUrl, setCsvUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file.');
        setSelectedFile(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size exceeds 10MB. Please upload a smaller file.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setUploadSuccess(false);
      setCsvUrl(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('https://queryginnebackend-496094639433.us-central1.run.app/uploadFile', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
          setUploadSuccess(true);
        } else {
          throw new Error('File upload failed');
        }
      })
      .catch(error => {
        console.error('Upload Error:', error);
        alert('An error occurred while uploading the file.');
      });
    }
  };

  const handleQuerySubmit = () => {
    fetch('https://queryginnebackend-496094639433.us-central1.run.app/processQuery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch CSV');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      setCsvUrl(url);
    })
    .catch(error => {
      console.error('Query Error:', error);
      alert('An error occurred while processing the query.');
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={!selectedFile}>Upload</UploadButton>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      
      {uploadSuccess && (
        <div>
          <QueryInput
            type="text"
            placeholder="Enter your Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SubmitButton onClick={handleQuerySubmit} disabled={!query.trim()}>Submit Query</SubmitButton>
        </div>
      )}

      {csvUrl && (
        <OutputContainer>
          <strong>Query Processed!</strong>
          <br />
          <a href={csvUrl} download="query_results.csv">
            <UploadButton>Download Results</UploadButton>
          </a>
        </OutputContainer>
      )}
    </div>
  );
};

export default FileUpload;
