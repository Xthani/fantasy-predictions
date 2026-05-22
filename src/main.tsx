import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@/app/styles/tokens.css';
import '@/app/styles/global.css';
import { App } from '@/app/App';
import { AuthProvider } from '@/features/auth/model/AuthProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html has <div id="root"></div>');
}

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? ''}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
