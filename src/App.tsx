import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home'; // This will be created in the next steps

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Soothing blue
    },
    secondary: {
      main: '#f50057', // Vibrant pink
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      <Toaster position="bottom-center" />
    </ThemeProvider>
  );
}

export default App;
