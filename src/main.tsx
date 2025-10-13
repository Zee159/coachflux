import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App.tsx'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (typeof convexUrl !== 'string') {
  throw new Error('VITE_CONVEX_URL is not defined');
}
const convex = new ConvexReactClient(convexUrl);

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
)
