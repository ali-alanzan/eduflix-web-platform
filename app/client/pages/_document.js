import Document, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../components/ui/Theme';
import {ThemeProvider} from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;