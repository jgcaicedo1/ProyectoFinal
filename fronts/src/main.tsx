import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './api/graphqlClient';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
