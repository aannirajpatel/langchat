import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';

import { LogtoProvider, LogtoConfig } from '@logto/react';
import { appId, endpoint } from './consts/index.ts';

const config: LogtoConfig = {
  endpoint,
  appId,
  resources: ['https://langchat.aanpatel.tech/api'],
  scopes: ['langchat:chat.full'],
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LogtoProvider config={config}>
      <App />
    </LogtoProvider>
  </React.StrictMode>,
);
