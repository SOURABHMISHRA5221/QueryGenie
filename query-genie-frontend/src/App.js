import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme, darkTheme, AppContainer, Overlay, ContentContainer } from './styles';
import FileUpload from './components/FileUpload.js';
import DatabaseUpload from './components/DatabaseUpload.js'; // Assuming you have this component

function App() {
  const [theme, setTheme] = useState(lightTheme);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Overlay />
        <ContentContainer>
          <h1>Query Selection</h1>
          <button onClick={toggleTheme}>
            {theme === lightTheme ? 'Dark Mode' : 'Light Mode'}
          </button>
          
          {!selectedOption ? (
            <div>
              <button onClick={() => setSelectedOption('file')}>Query to File?</button>
              <button onClick={() => setSelectedOption('database')}>Query to Database?</button>
            </div>
          ) : (
            <div>
              {selectedOption === 'file' ? <FileUpload /> : <DatabaseUpload />}
              <button onClick={() => setSelectedOption(null)}>Go Back</button>
            </div>
          )}
        </ContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
