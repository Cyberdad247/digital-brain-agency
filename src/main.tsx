/**
 * Application entry point
 *
 * @remarks
 * This file is responsible for:
 * - Setting up the React DOM renderer
 * - Selecting the root DOM element
 * - Importing global styles
 * - Rendering the main App component
 *
 * @example
 * ```tsx
 * // Renders the application into the #root element
 * createRoot(document.getElementById("root")!).render(<App />);
 * ```
 */
import { createRoot } from 'react-dom/client';
import React, { Suspense } from 'react';
import App from './App.tsx';
import './index.css';

// Monaco Editor Environment Setup
import loader from '@monaco-editor/loader';

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs',
  },
});

// Initialize Monaco
loader
  .init()
  .then((monaco) => {
    console.log('Monaco Editor initialized');
  })
  .catch((error) => {
    console.error('Error initializing Monaco Editor:', error);
  });

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

/**
 * Renders the application into the root DOM element
 * @throws Will throw an error if the root element is not found
 */
createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div>Loading editor...</div>}>
    <App />
  </Suspense>
);
