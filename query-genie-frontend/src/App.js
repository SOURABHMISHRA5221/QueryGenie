import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme, darkTheme, AppContainer, Overlay, ContentContainer } from './styles';
import FileUpload from './components/FileUpload.js';
import DatabaseUpload from './components/DatabaseUpload.js';

function App() {
  // Load theme from localStorage or default to system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      return savedTheme === 'dark' ? darkTheme : lightTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [selectedOption, setSelectedOption] = useState(null);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme === darkTheme ? 'dark' : 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
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
