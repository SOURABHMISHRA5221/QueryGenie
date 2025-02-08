import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.5s ease;
    font-family: sans-serif;
  }
  button {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.primaryDark};
    }
  }
`;



export const ContentContainer = styled.div`
  position: relative;
  z-index: 1; /* Above the overlay */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3); /* Adjust transparency */
    z-index: 0; /* Behind the content */
`;

export const lightTheme = {
  body: '#ffffff',
  text: '#000000',
  primary: '#007bff',
  primaryDark: '#0056b3',
  buttonText: '#ffffff',
};

export const darkTheme = {
  body: '#121212',
  text: '#ffffff',
  primary: '#212529',
  primaryDark: '#343a40',
  buttonText: '#ffffff',
};

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  position: relative; // Needed for overlay positioning
`;

export { ThemeProvider };