import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/gochi-hand';
import '@fontsource/patrick-hand';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
