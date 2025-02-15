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

const DatabaseUpload = () => {
  const [connectionString, setConnectionString] = useState('');
  const [database, setDatabase] = useState('');
  const [collections, setCollections] = useState(['']);

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
    const key = CryptoJS.enc.Hex.parse( SECRET_KEY); // Convert SHA-256 hash to a WordArray
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // Base64 encoded ciphertext
  };
  const handleSubmit = () => {
    if (!connectionString || !database || collections.some(col => col.trim() === '')) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const encryptedConnectionString = encryptData(connectionString);

    const payload = {
      database,
      collections,
      connectionString: encryptedConnectionString
    };

    fetch('https://queryginnebackend-496094639433.us-central1.run.app/mongoConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
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
      <UploadButton onClick={handleSubmit}>Submit</UploadButton>
    </div>
  );
};

export default DatabaseUpload;
