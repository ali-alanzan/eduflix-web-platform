import * as React from 'react';
import Header from "../components/ui/Header";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkScrollbar from '@mui/material/darkScrollbar';
import { StyledEngineProvider } from '@mui/material';

import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import {Provider} from '../context';
import GlobalStyles from '@mui/material/GlobalStyles';

const theme = createTheme({
    breakpoints: {
      values: {
        mobile: 0,
        tablet: 640,
        laptop: 1024,
        desktop: 1280,
      },
    }
  });

  const styles = {
    a: { textDecoration: 'none' },
    video: {opacity: '1 !important'}
  }

function MyApp({ Component, pageProps }) {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [value, setValue] = React.useState(0);  
  return (
    <React.StrictMode>
      <Provider>
          <CssBaseline enableColorScheme/>
          <GlobalStyles styles={{ ...styles }} />
          <ThemeProvider theme={theme}>
                <ToastContainer position="top-center" />
                <Header  setValue={setValue} setSelectedIndex={setSelectedIndex} value={value} selectedIndex={selectedIndex} />
              <Component {...pageProps} />
          </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}

export default MyApp;