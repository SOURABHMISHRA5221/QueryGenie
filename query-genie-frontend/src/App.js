import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme, darkTheme, AppContainer, Overlay, ContentContainer } from './styles'; // Import Overlay and ContentContainer
import FileUpload from './components/FileUpload.js';

function App() {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Overlay />  {/* The semi-transparent overlay */}
        <ContentContainer> {/* Container for your content */}
          <h1>File Uploader</h1>
          <button onClick={toggleTheme}>
            {theme === lightTheme ? 'Dark Mode' : 'Light Mode'}
          </button>
          <FileUpload />
        </ContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;