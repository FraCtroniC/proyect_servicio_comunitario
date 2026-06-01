import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import '@/styles/index.css';
import { ensureDefaultUsers } from '@/services/authCredentials';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento #root');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);

ensureDefaultUsers().catch((error) => {
  console.error('No se pudieron inicializar los usuarios:', error);
});
