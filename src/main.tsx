import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#1d4ed8', // Bleu Luxtrax
          colorText: '#0f172a',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#0f172a',
          borderRadius: '0.75rem'
        },
        elements: {
          card: 'shadow-none border border-slate-200 backdrop-blur-md bg-white/80',
          formButtonPrimary: 'shadow-md uppercase text-sm font-bold tracking-wide'
        }
      }}
    >
      <App />
      <Toaster position="top-center" richColors />
    </ClerkProvider>
  </React.StrictMode>,
);
