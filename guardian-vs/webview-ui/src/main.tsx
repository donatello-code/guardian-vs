import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./main.css"
import "./index.css"
import App from "./App.tsx"

// Register Service Worker for offline functionality and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Wait for window load to ensure document is in a valid state
  window.addEventListener('load', () => {
    // Use a timeout to ensure DOM is fully ready
    setTimeout(() => {
      navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      })
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New Service Worker found:', newWorker?.state);
          
          newWorker?.addEventListener('statechange', () => {
            console.log('Service Worker state changed:', newWorker.state);
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }, 100);
  });
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
