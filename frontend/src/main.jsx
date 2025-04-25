import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ton composant App principal
import { AuthProvider } from './contexts/AuthContext'; // AuthContext
import { BrowserRouter } from 'react-router-dom'; // 🔥 à ajouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 🔒 Pour activer le système de routes */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
