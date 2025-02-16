import React, { useState } from 'react';
import styled from 'styled-components';
import CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.SHA256("your-secret-key").toString(CryptoJS.enc.Hex);

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

const InputField = styled.input`
  display: block;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ResponseContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-family: monospace;
  white-space: pre-wrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  /* Dark Mode Support */
  background: ${({ theme }) => (theme === 'dark' ? '#2d2d2d' : '#f4f4f4')};
  color: ${({ theme }) => (theme === 'dark' ? '#ffffff' : '#000000')};
`;

const CopyButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #218838;
  }
`;

const DatabaseUpload = () => {
  const [connectionString, setConnectionString] = useState('');
  const [database, setDatabase] = useState('');
  const [collections, setCollections] = useState(['']);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  // Detects system theme
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const handleCollectionChange = (index, value) => {
    const updatedCollections = [...collections];
    updatedCollections[index] = value;
    setCollections(updatedCollections);
  };

  const addCollection = () => {
    setCollections([...collections, '']);
  };

  const removeCollection = (index) => {
    const updatedCollections = collections.filter((_, i) => i !== index);
    setCollections(updatedCollections);
  };

  const encryptData = (text) => {
    const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  const displayResponse = (text) => {
    setResponse('');
    setShowResponse(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setResponse((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("Response copied to clipboard!");
  };

  const handleSubmit = () => {
    if (!connectionString || !prompt || !database || collections.some(col => col.trim() === '')) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const encryptedConnectionString = encryptData(connectionString);

    const payload = {
      database,
      collections,
      connectionString: encryptedConnectionString,
      prompt,
    };

    fetch('https://queryginnebackend-496094639433.us-central1.run.app/mongoConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          displayResponse(data.response);
        } else {
          setResponse("No response received.");
          setShowResponse(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setResponse("Error fetching response.");
        setShowResponse(true);
      });
  };

  return (
    <div>
      <InputField 
        type="text" 
        placeholder="MongoDB Connection String" 
        value={connectionString} 
        onChange={(e) => setConnectionString(e.target.value)} 
      />
      <InputField 
        type="text" 
        placeholder="Database Name" 
        value={database} 
        onChange={(e) => setDatabase(e.target.value)} 
      />
      {collections.map((collection, index) => (
        <div key={index}>
          <InputField
            type="text"
            placeholder={`Collection Name ${index + 1}`}
            value={collection}
            onChange={(e) => handleCollectionChange(index, e.target.value)}
          />
          {index > 0 && (
            <button onClick={() => removeCollection(index)}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addCollection}>+ Add Collection</button>
      <InputField 
        type="text" 
        placeholder="Query" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
      />
      <UploadButton onClick={handleSubmit}>Submit</UploadButton>

      {showResponse && (
        <ResponseContainer theme={isDarkMode ? 'dark' : 'light'}>
          <div dangerouslySetInnerHTML={{ __html: response.replace(/(".*?")/g, '<b>$1</b>') }} />
          <CopyButton onClick={handleCopy}>Copy</CopyButton>
        </ResponseContainer>
      )}
    </div>
  );
};

export default DatabaseUpload;
