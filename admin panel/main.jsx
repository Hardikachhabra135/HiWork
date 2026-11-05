import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminPanel from './AdminPanel';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminPanel
      onBack={() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }}
    />
  </React.StrictMode>
);

