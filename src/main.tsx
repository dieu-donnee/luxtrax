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
          colorPrimary: '#0f766e',
          colorText: '#17211f',
          colorBackground: '#fdf9f3',
          colorInputBackground: '#fffdf9',
          colorInputText: '#17211f',
          borderRadius: '1rem'
        },
        elements: {
          card: 'shadow-none border border-stone-200 backdrop-blur-md bg-white/80',
          formButtonPrimary: 'shadow-md text-sm font-bold tracking-wide'
        }
      }}
    >
      <App />
      <Toaster position="top-center" richColors />
    </ClerkProvider>
  </React.StrictMode>,
);
