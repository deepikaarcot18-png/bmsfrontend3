import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BmsProvider } from './context/BmsState.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BmsProvider>
      <App />
    </BmsProvider>
  </React.StrictMode>
);
