import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createTheme } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';



const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      light: '#BBDEFB',
      dark: '#2196F3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#607D8B',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#BDBDBD',
    background: {
      default: '#f9fafb',
    },
    
  },
  
});




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>    
    <ThemeProvider theme={theme}>
      <CssBaseline>        
        <App />
      </CssBaseline>
    </ThemeProvider>
    
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
