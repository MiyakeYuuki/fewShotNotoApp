import React from 'react';
import ReactDOM from 'react-dom/client';
import Chat from './components/Chat';
//import GetKeywords from './api/GetKeywords';
//import App from './api/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Chat />
    {/* <App /> */}
  </React.StrictMode>
);
