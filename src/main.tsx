import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ScaleToFit from './components/ScaleToFit';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScaleToFit>
      <App />
    </ScaleToFit>
  </StrictMode>,
);
