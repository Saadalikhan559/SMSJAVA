import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';



// Suppress console logs in production
if (import.meta.env.MODE === 'production') {
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
  console.info = () => { };
}

// Initialize Sentry only in production before rendering the app
async function initializeSentry() {
  if (import.meta.env.MODE === 'production') {
    // Dynamically import all needed modules
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn: "https://d670a94e0b509fb2d4b685eedefc7fd6@o4510033571086336.ingest.us.sentry.io/4510033572331520",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
      debug: false,
    });
  }
}


// Run Sentry init and then render app
initializeSentry().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
