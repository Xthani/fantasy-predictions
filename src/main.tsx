import { createRoot } from 'react-dom/client';
import '@/app/styles/tokens.css';
import '@/app/styles/global.css';
import { App } from '@/app/App';
import { AuthProvider } from '@/features/auth';
import { OnboardingProvider } from '@/features/onboarding';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html has <div id="root"></div>');
}

createRoot(rootElement).render(
  <AuthProvider>
    <OnboardingProvider>
      <App />
    </OnboardingProvider>
  </AuthProvider>,
);
