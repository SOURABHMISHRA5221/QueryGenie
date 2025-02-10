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

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading:', selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('https://queryginnebackend-496094639433.us-central1.run.app/uploadFile', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={!selectedFile}>Upload</UploadButton>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;
